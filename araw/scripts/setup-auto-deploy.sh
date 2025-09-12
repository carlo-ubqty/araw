#!/bin/bash

# ARAW QA Auto-Deploy Setup Script
# Run this on EC2 server as araw_admin user

set -e  # Exit on any error

echo "🚀 Setting up ARAW QA Auto-Deploy System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if running as araw_admin
if [ "$(whoami)" != "araw_admin" ]; then
    print_error "This script must be run as araw_admin user"
    exit 1
fi

# Navigate to project directory
cd /var/www/ubqty/araw
print_status "Changed to project directory"

# Pull latest changes
git pull origin qa
print_status "Pulled latest changes from qa branch"

# Make scripts executable
chmod +x scripts/webhook-deploy.js
chmod +x scripts/rollback.sh
print_status "Made scripts executable"

# Stop existing webhook if running
pm2 delete araw-webhook 2>/dev/null || true
print_status "Cleaned up existing webhook process"

# Start webhook server with PM2
pm2 start scripts/webhook.ecosystem.config.js
print_status "Started webhook server with PM2"

# Save PM2 configuration
pm2 save
print_status "Saved PM2 configuration"

# Update Nginx configuration
print_warning "Updating Nginx configuration..."

sudo tee /etc/nginx/sites-available/araw-qa.ncience.com > /dev/null << 'EOF'
server {
    listen 80;
    server_name araw-qa.ncience.com;
    
    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Webhook endpoint for auto-deploy
    location /webhook {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # GitHub webhook specific headers
        proxy_set_header X-Hub-Signature-256 $http_x_hub_signature_256;
        proxy_set_header X-GitHub-Event $http_x_github_event;
        proxy_set_header X-GitHub-Delivery $http_x_github_delivery;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
    
    # Status endpoint
    location /status {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
    
    # Manual rollback endpoint (secured)
    location /rollback {
        # Optional: Add IP restrictions for security
        # allow 192.168.1.0/24;  # Your office IP range
        # deny all;
        
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

print_status "Updated Nginx configuration"

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
print_status "Reloaded Nginx with new configuration"

# Test webhook server
echo ""
echo "🧪 Testing webhook server..."
sleep 2

if curl -s http://localhost:3001/health > /dev/null; then
    print_status "Webhook server is responding locally"
else
    print_error "Webhook server is not responding on localhost:3001"
    exit 1
fi

if curl -s http://araw-qa.ncience.com/health > /dev/null; then
    print_status "Webhook server is accessible via domain"
else
    print_warning "Webhook server may not be accessible via domain yet"
fi

# Display status
echo ""
echo "📊 System Status:"
echo "=================="
pm2 status

echo ""
echo "🎉 Auto-Deploy Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to: https://github.com/carlo-ubqty/araw/settings/hooks"
echo "2. Add webhook with:"
echo "   - Payload URL: http://araw-qa.ncience.com/webhook"
echo "   - Content type: application/json"
echo "   - Secret: araw-qa-deploy-secret-2025"
echo "   - Events: Just the push event"
echo ""
echo "🔗 Useful Commands:"
echo "   pm2 status                               # Check services"
echo "   pm2 logs araw-webhook                   # View webhook logs"
echo "   tail -f local/auto-deploy.log           # View deployment logs"
echo "   curl http://araw-qa.ncience.com/health  # Test webhook health"
echo "   curl http://araw-qa.ncience.com/status  # Check deployment status"
echo "   ./scripts/rollback.sh                   # Manual rollback"
echo "   curl -X POST http://araw-qa.ncience.com/rollback  # Remote rollback"
echo ""
echo "✨ Test by pushing to qa branch - deployment should happen automatically!"

# Create initial log file
touch local/auto-deploy.log
echo "[$(date -Iseconds)] 🎉 Auto-deploy system initialized" >> local/auto-deploy.log

print_status "Setup completed successfully!"
