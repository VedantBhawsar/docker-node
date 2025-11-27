#!/bin/bash
set -euo pipefail

# Rollback script for manual deployment recovery
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_DIR="${PROJECT_DIR:-apps/docker-node}"
BACKUP_DIR="$PROJECT_DIR/backups"

echo -e "${YELLOW}Initiating rollback...${NC}"

cd "$PROJECT_DIR" || exit 1

# Check if backups exist
if [ ! -d "$BACKUP_DIR" ]; then
  echo -e "${RED}Backup directory not found!${NC}"
  exit 1
fi

# List available backups
echo -e "${YELLOW}Available backups:${NC}"
ls -lht "$BACKUP_DIR"

# Restore from latest backup
if [ -f "$BACKUP_DIR/docker-compose.yml.backup" ]; then
  echo -e "${YELLOW}Restoring docker-compose.yml...${NC}"
  cp "$BACKUP_DIR/docker-compose.yml.backup" docker-compose.yml
fi

if [ -f "$BACKUP_DIR/.env.backup" ]; then
  echo -e "${YELLOW}Restoring .env file...${NC}"
  cp "$BACKUP_DIR/.env.backup" .env
fi

# Stop current containers
echo -e "${YELLOW}Stopping current containers...${NC}"
docker compose down

# Start containers with restored configuration
echo -e "${YELLOW}Starting containers with restored configuration...${NC}"
docker compose up -d

# Wait and check health
sleep 10

if curl -f -s http://localhost:3000/health > /dev/null 2>&1; then
  echo -e "${GREEN}Rollback successful! Services are healthy.${NC}"
  docker compose ps
  exit 0
else
  echo -e "${RED}Rollback completed but health check failed. Please investigate manually.${NC}"
  docker compose logs --tail=50
  exit 1
fi
