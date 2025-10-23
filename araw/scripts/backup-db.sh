#!/bin/bash
# ============================================================================
# ARAW V3.0 Dashboard - Database Backup Script
# ============================================================================
# Usage:
#   ./scripts/backup-db.sh [local|uat|prod]
#
# Creates timestamped backup in database/backups/ directory
# ============================================================================

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================================
# CONFIGURATION
# ============================================================================

ENVIRONMENT=${1:-local}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="database/backups"
mkdir -p "$BACKUP_DIR"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}ARAW V3.0 Database Backup${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Environment: ${YELLOW}$ENVIRONMENT${NC}"
echo ""

# ============================================================================
# LOAD ENVIRONMENT-SPECIFIC CREDENTIALS
# ============================================================================

case $ENVIRONMENT in
  local)
    DB_HOST="localhost"
    DB_PORT="3306"
    DB_USER="root"
    DB_PASSWORD="root"
    DB_NAME="araw_climate_finance"
    ;;
  uat)
    if [ -f .env.uat ]; then
      source .env.uat
    else
      echo -e "${RED}Error: .env.uat file not found${NC}"
      exit 1
    fi
    ;;
  prod)
    if [ -f .env.prod ]; then
      source .env.prod
    else
      echo -e "${RED}Error: .env.prod file not found${NC}"
      exit 1
    fi
    ;;
esac

# ============================================================================
# CREATE BACKUP
# ============================================================================

BACKUP_FILE="$BACKUP_DIR/${ENVIRONMENT}_${DB_NAME}_${TIMESTAMP}.sql"

echo -e "${YELLOW}Creating backup...${NC}"
mysqldump -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" \
  --single-transaction \
  --routines \
  --triggers \
  --events \
  "$DB_NAME" > "$BACKUP_FILE"

# Compress backup
echo -e "${YELLOW}Compressing backup...${NC}"
gzip "$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

# ============================================================================
# VERIFY BACKUP
# ============================================================================

BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Backup completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "File: ${YELLOW}$BACKUP_FILE${NC}"
echo -e "Size: ${YELLOW}$BACKUP_SIZE${NC}"
echo ""

