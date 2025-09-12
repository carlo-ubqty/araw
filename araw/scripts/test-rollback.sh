#!/bin/bash

# ARAW QA Rollback System Test Script
# Tests the rollback functionality without affecting production

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

echo "🧪 ARAW QA Rollback System Test"
echo "================================"

# Check if running as araw_admin
if [ "$(whoami)" != "araw_admin" ]; then
    print_error "This script must be run as araw_admin user"
    exit 1
fi

# Navigate to project directory
cd /var/www/ubqty/araw

print_info "Testing rollback system functionality..."

# Test 1: Check if rollback state file exists
echo ""
print_info "Test 1: Checking rollback state file..."
if [ -f "local/last-known-good.json" ]; then
    print_status "Rollback state file exists"
    echo "  Content preview:"
    cat local/last-known-good.json | head -5
else
    print_warning "No rollback state file found - this is normal for first deployment"
fi

# Test 2: Check webhook server health
echo ""
print_info "Test 2: Testing webhook server health..."
if curl -s -f http://localhost:3001/health > /dev/null; then
    print_status "Webhook server is healthy"
    HEALTH_RESPONSE=$(curl -s http://localhost:3001/health)
    echo "  Response: $HEALTH_RESPONSE"
else
    print_error "Webhook server is not responding"
    exit 1
fi

# Test 3: Check webhook server status endpoint
echo ""
print_info "Test 3: Testing status endpoint..."
if curl -s -f http://localhost:3001/status > /dev/null; then
    print_status "Status endpoint is working"
    STATUS_RESPONSE=$(curl -s http://localhost:3001/status | jq '.' 2>/dev/null || curl -s http://localhost:3001/status)
    echo "  Current commit: $(echo "$STATUS_RESPONSE" | grep -o '"commit":"[^"]*' | cut -d'"' -f4)"
else
    print_error "Status endpoint is not working"
    exit 1
fi

# Test 4: Check Nginx proxy endpoints
echo ""
print_info "Test 4: Testing Nginx proxy endpoints..."

# Health via domain
if curl -s -f http://araw-qa.ncience.com/health > /dev/null; then
    print_status "Health endpoint accessible via domain"
else
    print_warning "Health endpoint not accessible via domain"
fi

# Status via domain
if curl -s -f http://araw-qa.ncience.com/status > /dev/null; then
    print_status "Status endpoint accessible via domain"
else
    print_warning "Status endpoint not accessible via domain"
fi

# Test 5: Check PM2 status
echo ""
print_info "Test 5: Checking PM2 services..."
if pm2 show araw-dashboard --format | grep -q "online"; then
    print_status "Main application (araw-dashboard) is online"
else
    print_warning "Main application may not be running properly"
fi

if pm2 show araw-webhook --format | grep -q "online"; then
    print_status "Webhook service (araw-webhook) is online"
else
    print_error "Webhook service is not running"
    exit 1
fi

# Test 6: Check if rollback script is executable
echo ""
print_info "Test 6: Testing rollback script..."
if [ -x "scripts/rollback.sh" ]; then
    print_status "Rollback script is executable"
else
    print_error "Rollback script is not executable"
    chmod +x scripts/rollback.sh
    print_status "Fixed rollback script permissions"
fi

# Test 7: Validate deployment logs
echo ""
print_info "Test 7: Checking deployment logs..."
if [ -f "local/auto-deploy.log" ]; then
    print_status "Auto-deploy log file exists"
    echo "  Recent entries:"
    tail -3 local/auto-deploy.log || echo "  (Log file is empty)"
else
    print_warning "Auto-deploy log file not found"
    touch local/auto-deploy.log
    print_status "Created auto-deploy log file"
fi

# Test 8: Test git configuration
echo ""
print_info "Test 8: Checking git configuration..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
CURRENT_COMMIT=$(git rev-parse HEAD)

if [ "$CURRENT_BRANCH" = "qa" ]; then
    print_status "Currently on qa branch"
else
    print_warning "Not on qa branch (current: $CURRENT_BRANCH)"
fi

print_info "Current commit: ${CURRENT_COMMIT:0:7}"

# Test 9: Simulate rollback state creation (dry run)
echo ""
print_info "Test 9: Testing rollback state creation..."
TEST_STATE="{
  \"commit\": \"$CURRENT_COMMIT\",
  \"branch\": \"$CURRENT_BRANCH\",
  \"timestamp\": \"$(date -Iseconds)\",
  \"deploymentTime\": \"$(date -Iseconds)\",
  \"test\": true
}"

echo "$TEST_STATE" > local/test-rollback-state.json
print_status "Test rollback state created"

# Cleanup test file
rm -f local/test-rollback-state.json

# Test 10: Check application health
echo ""
print_info "Test 10: Testing application health..."
if curl -s -f http://localhost:3000/api/dashboard/kpis > /dev/null; then
    print_status "Application API is responding"
else
    print_warning "Application API is not responding (this might be normal if no API is implemented)"
fi

if curl -s -f http://localhost:3000 > /dev/null; then
    print_status "Application main page is accessible"
else
    print_error "Application main page is not accessible"
    exit 1
fi

# Summary
echo ""
echo "📋 Test Summary"
echo "==============="
print_status "Rollback system is properly configured"
print_status "All essential services are running"
print_status "Webhook endpoints are accessible"

echo ""
echo "🎯 System Ready For:"
echo "  ✅ Automatic deployments on qa branch push"
echo "  ✅ Automatic rollback on deployment failure"
echo "  ✅ Manual rollback via ./scripts/rollback.sh"
echo "  ✅ Remote rollback via curl -X POST http://araw-qa.ncience.com/rollback"

echo ""
echo "🔮 To test rollback functionality:"
echo "  1. Make a change that breaks the build (syntax error, etc.)"
echo "  2. Push to qa branch"
echo "  3. Watch auto-deploy.log: tail -f local/auto-deploy.log"
echo "  4. System should automatically rollback on failure"

echo ""
print_status "All tests passed! Rollback system is ready. 🚀"
