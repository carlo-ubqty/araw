# ARAW QA Auto-Deploy Setup Guide

## Overview
This guide sets up automatic deployment for the QA environment when code is pushed to the `qa` branch on GitHub.

## Architecture
- **GitHub Webhook** → **Nginx Proxy** → **Node.js Webhook Server** → **Auto Deploy Script**
- Webhook server runs on port 3001
- Nginx proxies `/webhook` requests to the webhook server
- PM2 manages both the main app and webhook server

## Setup Instructions

### Step 1: Deploy Webhook Files to Server

```bash
# On your local machine - commit and push the webhook files
git add scripts/webhook-deploy.js scripts/webhook.ecosystem.config.js local/auto-deploy-setup.md
git commit -m "Add auto-deploy webhook system"
git push origin qa
```

### Step 2: Configure Server (on EC2 as araw_admin)

```bash
# Navigate to project directory
cd /var/www/ubqty/araw

# Pull latest changes
git pull origin qa

# Make webhook script executable
chmod +x scripts/webhook-deploy.js

# Start webhook server with PM2
pm2 start scripts/webhook.ecosystem.config.js

# Check status
pm2 status

# Save PM2 configuration
pm2 save
```

### Step 3: Configure Nginx Reverse Proxy

```bash
# Update Nginx configuration to include webhook endpoint
sudo tee /etc/nginx/sites-available/araw-qa.ncience.com << 'EOF'
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
}
EOF

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: Test Webhook Server

```bash
# Test health endpoint
curl http://araw-qa.ncience.com/health

# Expected response:
# {"status":"healthy","service":"araw-qa-webhook","timestamp":"2025-09-12T..."}
```

### Step 5: Configure GitHub Webhook

1. **Go to your GitHub repository**: https://github.com/carlo-ubqty/araw
2. **Navigate to Settings** → **Webhooks** → **Add webhook**
3. **Configure webhook**:
   - **Payload URL**: `http://araw-qa.ncience.com/webhook`
   - **Content type**: `application/json`
   - **Secret**: `araw-qa-deploy-secret-2025`
   - **Which events**: Select "Just the push event"
   - **Active**: ✅ Checked

4. **Save webhook**

### Step 6: Test Auto-Deploy

```bash
# Make a small change to test auto-deploy
echo "# Auto-deploy test" >> README.md
git add README.md
git commit -m "Test auto-deploy system"
git push origin qa

# Check deployment logs
tail -f /var/www/ubqty/araw/local/auto-deploy.log

# Check webhook server status
pm2 logs araw-webhook --lines 20
```

## Monitoring & Maintenance

### Check Services Status
```bash
pm2 status                    # Both araw-dashboard and araw-webhook should be online
sudo systemctl status nginx   # Nginx should be active
```

### View Logs
```bash
# Auto-deploy logs
tail -f /var/www/ubqty/araw/local/auto-deploy.log

# Webhook server logs
pm2 logs araw-webhook

# Main application logs
pm2 logs araw-dashboard

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Manual Deploy (if needed)
```bash
cd /var/www/ubqty/araw
git pull origin qa
npm run build
pm2 restart araw-dashboard
```

## Security Notes

- The webhook secret (`araw-qa-deploy-secret-2025`) should be kept secure
- Only pushes to the `qa` branch trigger deployments
- The webhook server verifies GitHub signatures for security
- Failed deployments attempt to restart the previous version

## Troubleshooting

### Webhook Not Triggering
1. Check GitHub webhook deliveries in repository settings
2. Verify webhook server is running: `pm2 status`
3. Check Nginx configuration: `sudo nginx -t`
4. Review webhook logs: `pm2 logs araw-webhook`

### Deployment Failures
1. Check auto-deploy logs: `tail -f /var/www/ubqty/araw/local/auto-deploy.log`
2. Verify PM2 status: `pm2 status`
3. Check build logs: `pm2 logs araw-dashboard`
4. Manual restart: `pm2 restart araw-dashboard`

### Port Conflicts
- Main app: Port 3000
- Webhook: Port 3001
- Nginx: Port 80/443

If ports are in use, update the configuration files accordingly.

## Success Indicators

✅ **Setup Complete When:**
- PM2 shows both `araw-dashboard` and `araw-webhook` as online
- `curl http://araw-qa.ncience.com/health` returns healthy status
- GitHub webhook shows successful deliveries
- Push to qa branch triggers automatic deployment
- Application updates automatically within 1-2 minutes of push

## Auto-Deploy Flow with Rollback

### Successful Deployment:
1. Developer pushes to `qa` branch
2. GitHub sends webhook to `araw-qa.ncience.com/webhook`
3. Nginx routes request to webhook server (port 3001)
4. Webhook server verifies signature and branch
5. **Save current state** (commit hash, timestamp)
6. Auto-deploy script executes:
   - `git fetch origin`
   - `git reset --hard origin/qa`
   - `npm ci --only=production` (if package.json changed)
   - `npm run build`
   - `pm2 restart araw-dashboard`
   - **Health check** (3 attempts, API response test)
   - **PM2 status verification**
7. Application is live with latest changes
8. Deployment logged to `auto-deploy.log`

### Failed Deployment with Auto-Rollback:
1. Steps 1-5 same as above
2. Deployment fails at any step (build error, health check failure, etc.)
3. **Automatic rollback initiated**:
   - `git reset --hard [previous-commit]`
   - `npm run build` (rebuild previous version)
   - `pm2 restart araw-dashboard`
   - **Rollback health check**
4. System restored to last known good state
5. Failure and rollback logged to `auto-deploy.log`
6. **Developer notified** via webhook response

**Total deployment time: ~30-60 seconds** ⚡  
**Total rollback time: ~45-90 seconds** 🔄

## Rollback System Features

### Automatic Rollback Triggers:
- Build failures (`npm run build` fails)
- Health check failures (API not responding)
- PM2 startup failures
- Application crashes during deployment

### Manual Rollback Options:

#### 1. Command Line Rollback:
```bash
# Interactive rollback with confirmation
./scripts/rollback.sh

# Shows current vs rollback commit
# Requires 'yes' confirmation
# Full rebuild and restart
```

#### 2. Remote API Rollback:
```bash
# Quick remote rollback via webhook
curl -X POST http://araw-qa.ncience.com/rollback

# Returns JSON with rollback status
# No confirmation required
# Use with caution!
```

#### 3. Status Monitoring:
```bash
# Check current deployment status
curl http://araw-qa.ncience.com/status

# Returns:
# - Current commit
# - Last known good commit  
# - PM2 status
# - Memory/CPU usage
```

### Rollback State Management:
- **State File**: `local/last-known-good.json`
- **Contains**: Commit hash, branch, timestamp
- **Updated**: Before each deployment attempt
- **Preserved**: Across server restarts

### Safety Features:
- **Health Checks**: API response validation
- **State Validation**: Ensures rollback target exists
- **Graceful Degradation**: Emergency restart if rollback fails
- **Comprehensive Logging**: All actions logged with timestamps
- **Rollback Verification**: Health check after rollback
