#!/bin/bash
set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="${PROJECT_DIR:-apps/docker-node}"
BACKUP_DIR="$PROJECT_DIR/backups"
DEPLOYMENT_ID="deploy-$(date +%Y%m%d-%H%M%S)"
MAX_BACKUPS=5
HEALTH_CHECK_URL="${HEALTH_CHECK_URL:-http://localhost:3000/health}"

echo -e "${GREEN}Starting deployment: $DEPLOYMENT_ID${NC}"

# Navigate to project directory
cd "$PROJECT_DIR" || exit 1

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Function to check service health
check_health() {
  local max_retries=$1
  local interval=$2

  for i in $(seq 1 "$max_retries"); do
    if curl -f -s "$HEALTH_CHECK_URL" > /dev/null 2>&1; then
      echo -e "${GREEN}Health check passed${NC}"
      return 0
    fi
    echo -e "${YELLOW}Health check attempt $i/$max_retries failed, retrying in ${interval}s...${NC}"
    sleep "$interval"
  done

  echo -e "${RED}Health check failed after $max_retries attempts${NC}"
  return 1
}

# Function to rollback
rollback() {
  echo -e "${RED}Deployment failed. Initiating rollback...${NC}"

  if [ -f "$BACKUP_DIR/docker-compose.yml.backup" ]; then
    cp "$BACKUP_DIR/docker-compose.yml.backup" docker-compose.yml
    cp "$BACKUP_DIR/.env.backup" .env 2>/dev/null || true

    docker compose up -d --force-recreate

    if check_health 5 3; then
      echo -e "${GREEN}Rollback successful${NC}"
      exit 0
    else
      echo -e "${RED}Rollback failed. Manual intervention required!${NC}"
      exit 1
    fi
  else
    echo -e "${RED}No backup found. Manual intervention required!${NC}"
    exit 1
  fi
}

# Trap errors and rollback
trap 'rollback' ERR

# Backup current configuration
echo -e "${YELLOW}Creating backup...${NC}"
if [ -f "docker-compose.yml" ]; then
  cp docker-compose.yml "$BACKUP_DIR/docker-compose.yml.backup"
fi
if [ -f ".env" ]; then
  cp .env "$BACKUP_DIR/.env.backup"
fi

# Save current container state
docker compose ps --format json > "$BACKUP_DIR/containers.backup.json" 2>/dev/null || true

# Pull latest changes
echo -e "${YELLOW}Pulling latest changes from GitHub...${NC}"
git fetch origin main
git reset --hard origin/main

# Build new images with deployment tag
echo -e "${YELLOW}Building new Docker images...${NC}"
docker compose build --no-cache

# Tag current running containers as "previous"
echo -e "${YELLOW}Tagging current containers...${NC}"
docker compose ps --services | while read -r service; do
  container_id=$(docker compose ps -q "$service" 2>/dev/null || true)
  if [ -n "$container_id" ]; then
    docker tag "$container_id" "${service}:previous" 2>/dev/null || true
  fi
done

# Perform blue-green deployment for app service
echo -e "${YELLOW}Starting new app containers (blue-green deployment)...${NC}"
docker compose up -d --no-deps --scale app=2 app

# Wait for new container to be healthy
echo -e "${YELLOW}Waiting for new containers to be healthy...${NC}"
sleep 10

if check_health 10 5; then
  echo -e "${GREEN}New containers are healthy${NC}"

  # Scale down to single instance
  echo -e "${YELLOW}Scaling down to production configuration...${NC}"
  docker compose up -d --scale app=1 app

  # Start/restart other services
  docker compose up -d --remove-orphans

  # Final health check
  sleep 5
  if check_health 5 3; then
    echo -e "${GREEN}Deployment successful!${NC}"

    # Cleanup old backups (keep last MAX_BACKUPS)
    echo -e "${YELLOW}Cleaning up old backups...${NC}"
    find "$BACKUP_DIR" -name "*.backup" -type f -printf '%T@ %p\n' | \
      sort -rn | tail -n +$((MAX_BACKUPS + 1)) | cut -d' ' -f2- | \
      xargs -r rm 2>/dev/null || true

    # Prune unused Docker resources
    echo -e "${YELLOW}Cleaning up Docker resources...${NC}"
    docker image prune -f --filter "until=24h"

    echo -e "${GREEN}Deployment $DEPLOYMENT_ID completed successfully${NC}"
    exit 0
  else
    echo -e "${RED}Final health check failed${NC}"
    rollback
  fi
else
  echo -e "${RED}Initial health check failed${NC}"
  rollback
fi
