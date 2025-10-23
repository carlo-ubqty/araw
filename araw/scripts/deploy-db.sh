#!/bin/bash
# ============================================================================
# ARAW V3.0 Dashboard - Database Deployment Script
# ============================================================================
# Usage:
#   ./scripts/deploy-db.sh [local|uat|prod] [--with-seed]
#
# Examples:
#   ./scripts/deploy-db.sh local --with-seed    # Deploy locally with sample data
#   ./scripts/deploy-db.sh uat                  # Deploy to UAT without sample data
#   ./scripts/deploy-db.sh prod                 # Deploy to production (schema only)
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================================
# CONFIGURATION
# ============================================================================

ENVIRONMENT=${1:-local}
WITH_SEED=${2}

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}ARAW V3.0 Database Deployment${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Environment: ${YELLOW}$ENVIRONMENT${NC}"
echo -e "With Seed Data: ${YELLOW}${WITH_SEED}${NC}"
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
    echo -e "${YELLOW}Loading UAT credentials from .env.uat...${NC}"
    # Source UAT environment file if it exists
    if [ -f .env.uat ]; then
      source .env.uat
    else
      echo -e "${RED}Error: .env.uat file not found${NC}"
      exit 1
    fi
    ;;
  prod)
    echo -e "${YELLOW}Loading PRODUCTION credentials from .env.prod...${NC}"
    # Source production environment file if it exists
    if [ -f .env.prod ]; then
      source .env.prod
    else
      echo -e "${RED}Error: .env.prod file not found${NC}"
      exit 1
    fi
    
    # Safety check for production
    echo -e "${RED}WARNING: You are about to deploy to PRODUCTION!${NC}"
    read -p "Type 'DEPLOY' to continue: " CONFIRM
    if [ "$CONFIRM" != "DEPLOY" ]; then
      echo -e "${RED}Deployment cancelled.${NC}"
      exit 1
    fi
    ;;
  *)
    echo -e "${RED}Error: Unknown environment '$ENVIRONMENT'${NC}"
    echo "Valid environments: local, uat, prod"
    exit 1
    ;;
esac

# ============================================================================
# CHECK MYSQL AVAILABILITY
# ============================================================================

echo -e "${YELLOW}Checking MySQL connection...${NC}"
if ! mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1" > /dev/null 2>&1; then
  echo -e "${RED}Error: Cannot connect to MySQL at $DB_HOST:$DB_PORT${NC}"
  exit 1
fi
echo -e "${GREEN}✓ MySQL connection successful${NC}"
echo ""

# ============================================================================
# CREATE DATABASE IF NOT EXISTS
# ============================================================================

echo -e "${YELLOW}Creating database '$DB_NAME' if not exists...${NC}"
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
echo -e "${GREEN}✓ Database ready${NC}"
echo ""

# ============================================================================
# DEPLOY SCHEMA
# ============================================================================

echo -e "${YELLOW}Deploying database schema...${NC}"
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < database/schema.sql
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Schema deployed successfully${NC}"
else
  echo -e "${RED}Error: Schema deployment failed${NC}"
  exit 1
fi
echo ""

# ============================================================================
# DEPLOY SEED DATA (if requested)
# ============================================================================

if [ "$WITH_SEED" == "--with-seed" ]; then
  echo -e "${YELLOW}Deploying seed data...${NC}"
  
  if [ "$ENVIRONMENT" == "prod" ]; then
    echo -e "${RED}WARNING: Deploying seed data to PRODUCTION!${NC}"
    read -p "Are you sure? (yes/no): " SEED_CONFIRM
    if [ "$SEED_CONFIRM" != "yes" ]; then
      echo -e "${YELLOW}Skipping seed data.${NC}"
    else
      mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < database/seed.sql
      echo -e "${GREEN}✓ Seed data deployed${NC}"
    fi
  else
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < database/seed.sql
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}✓ Seed data deployed successfully${NC}"
    else
      echo -e "${RED}Error: Seed data deployment failed${NC}"
      exit 1
    fi
  fi
  echo ""
fi

# ============================================================================
# VERIFY DEPLOYMENT
# ============================================================================

echo -e "${YELLOW}Verifying deployment...${NC}"

# Check table count
TABLE_COUNT=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -se "SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA = '$DB_NAME'")
echo -e "Tables created: ${GREEN}$TABLE_COUNT${NC}"

# List tables
echo -e "\nTables in database:"
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SHOW TABLES"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Database: ${YELLOW}$DB_NAME${NC}"
echo -e "Host: ${YELLOW}$DB_HOST:$DB_PORT${NC}"
echo -e "Tables: ${YELLOW}$TABLE_COUNT${NC}"
echo ""

