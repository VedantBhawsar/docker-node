#!/bin/bash
set -euo pipefail

# Database migration script
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Running database migrations...${NC}"

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Run migrations
if npx migrate-mongo up; then
  echo -e "${GREEN}Migrations completed successfully${NC}"
  npx migrate-mongo status
  exit 0
else
  echo -e "${RED}Migrations failed!${NC}"
  exit 1
fi
