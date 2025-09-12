#!/bin/bash

# ARAW QA Manual Rollback Script
# Run this on EC2 server as araw_admin user to manually rollback

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if running as araw_admin
if [ "$(whoami)" != "araw_admin" ]; then
    print_error "This script must be run as araw_admin user"
    exit 1
fi

# Navigate to project directory
cd /var/www/ubqty/araw

ROLLBACK_STATE_FILE="local/last-known-good.json"

echo "🔄 ARAW QA Manual Rollback Tool"
echo "================================"

# Check if rollback state exists
if [ ! -f "$ROLLBACK_STATE_FILE" ]; then
    print_error "No rollback state file found at $ROLLBACK_STATE_FILE"
    print_info "Cannot perform rollback without a previous known good state"
    exit 1
fi

# Show current state
echo ""
print_info "Current State:"
CURRENT_COMMIT=$(git rev-parse HEAD)
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "  Branch: $CURRENT_BRANCH"
echo "  Commit: ${CURRENT_COMMIT:0:7}"

# Show rollback target
echo ""
print_info "Last Known Good State:"
ROLLBACK_COMMIT=$(cat "$ROLLBACK_STATE_FILE" | grep -o '"commit":"[^"]*' | cut -d'"' -f4)
ROLLBACK_TIMESTAMP=$(cat "$ROLLBACK_STATE_FILE" | grep -o '"timestamp":"[^"]*' | cut -d'"' -f4)

if [ -z "$ROLLBACK_COMMIT" ]; then
    print_error "Invalid rollback state file"
    exit 1
fi

echo "  Commit: ${ROLLBACK_COMMIT:0:7}"
echo "  Time: $ROLLBACK_TIMESTAMP"

# Show PM2 status
echo ""
print_info "Current PM2 Status:"
pm2 show araw-dashboard --format | grep -E "(status|pid|memory|cpu)" || echo "  Application may not be running"

# Confirm rollback
echo ""
echo "🤔 Do you want to rollback from ${CURRENT_COMMIT:0:7} to ${ROLLBACK_COMMIT:0:7}?"
read -p "Type 'yes' to confirm: " -r
echo

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    print_warning "Rollback cancelled"
    exit 0
fi

echo "🚀 Starting manual rollback..."

# Log rollback start
echo "[$(date -Iseconds)] 🔄 Manual rollback initiated: ${CURRENT_COMMIT:0:7} → ${ROLLBACK_COMMIT:0:7}" >> local/auto-deploy.log

# Perform rollback
echo ""
print_info "Step 1: Resetting to rollback commit..."
if git reset --hard "$ROLLBACK_COMMIT"; then
    print_status "Git reset successful"
else
    print_error "Git reset failed"
    exit 1
fi

print_info "Step 2: Rebuilding application..."
if npm run build; then
    print_status "Build successful"
else
    print_error "Build failed"
    # Try to reset back
    git reset --hard "$CURRENT_COMMIT"
    print_warning "Reset back to previous commit due to build failure"
    exit 1
fi

print_info "Step 3: Restarting application..."
if pm2 restart araw-dashboard; then
    print_status "PM2 restart successful"
else
    print_error "PM2 restart failed"
    exit 1
fi

# Wait for app to start
print_info "Step 4: Waiting for application to start..."
sleep 5

# Check PM2 status
print_info "Step 5: Verifying rollback..."
if pm2 show araw-dashboard --format | grep -q "online"; then
    print_status "Application is online"
else
    print_error "Application failed to start after rollback"
    exit 1
fi

# Health check
print_info "Step 6: Performing health check..."
if curl -s -f http://localhost:3000/api/dashboard/kpis > /dev/null; then
    print_status "Health check passed"
else
    print_warning "Health check failed, but application appears to be running"
fi

# Success
echo ""
echo "🎉 Manual rollback completed successfully!"
echo ""
print_status "Current commit: ${ROLLBACK_COMMIT:0:7}"
print_status "Application status: Online"

# Log rollback completion
echo "[$(date -Iseconds)] ✅ Manual rollback completed successfully: ${ROLLBACK_COMMIT:0:7}" >> local/auto-deploy.log

echo ""
print_info "You can check the application at: http://araw-qa.ncience.com"
print_info "View logs with: pm2 logs araw-dashboard"
print_info "Check status with: pm2 status"

echo ""
echo "📋 Next Steps:"
echo "1. Verify the application is working correctly"
echo "2. Investigate why the previous deployment failed"
echo "3. Fix issues before pushing new changes to qa branch"
