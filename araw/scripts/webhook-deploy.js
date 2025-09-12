#!/usr/bin/env node

/**
 * ARAW QA Auto-Deploy Webhook Server
 * Automatically deploys when qa branch receives a push
 */

const http = require('http');
const { execSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = process.env.WEBHOOK_PORT || 3001;
const SECRET = process.env.WEBHOOK_SECRET || 'araw-qa-deploy-secret-2025';
const PROJECT_DIR = '/var/www/ubqty/araw';
const LOG_FILE = path.join(PROJECT_DIR, 'local', 'auto-deploy.log');

// Logging utility
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());
  
  try {
    fs.appendFileSync(LOG_FILE, logMessage);
  } catch (err) {
    console.error('Failed to write to log file:', err.message);
  }
}

// Verify GitHub webhook signature
function verifySignature(payload, signature) {
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', SECRET)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature), 
    Buffer.from(expectedSignature)
  );
}

// Rollback state management
const ROLLBACK_STATE_FILE = path.join(PROJECT_DIR, 'local', 'last-known-good.json');

// Save current state before deployment
function saveCurrentState() {
  try {
    const currentCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    const timestamp = new Date().toISOString();
    
    const state = {
      commit: currentCommit,
      branch: currentBranch,
      timestamp,
      deploymentTime: timestamp
    };
    
    fs.writeFileSync(ROLLBACK_STATE_FILE, JSON.stringify(state, null, 2));
    log(`💾 Saved current state: ${currentCommit.substring(0, 7)} (${currentBranch})`);
    return state;
  } catch (error) {
    log(`⚠️  Failed to save current state: ${error.message}`);
    return null;
  }
}

// Load last known good state
function loadLastKnownGood() {
  try {
    if (!fs.existsSync(ROLLBACK_STATE_FILE)) {
      return null;
    }
    const state = JSON.parse(fs.readFileSync(ROLLBACK_STATE_FILE, 'utf8'));
    return state;
  } catch (error) {
    log(`⚠️  Failed to load rollback state: ${error.message}`);
    return null;
  }
}

// Perform rollback to last known good state
async function performRollback(reason = 'Deployment failure') {
  log(`🔄 Initiating rollback: ${reason}`);
  
  try {
    const lastGood = loadLastKnownGood();
    if (!lastGood) {
      throw new Error('No rollback state available');
    }
    
    log(`📋 Rolling back to: ${lastGood.commit.substring(0, 7)} from ${lastGood.timestamp}`);
    
    // Reset to last known good commit
    execSync(`git reset --hard ${lastGood.commit}`, { stdio: 'pipe' });
    log('✅ Git: Reset to last known good commit');
    
    // Rebuild application
    execSync('npm run build', { stdio: 'pipe' });
    log('✅ Build: Rollback version built successfully');
    
    // Restart PM2 application
    execSync('pm2 restart araw-dashboard', { stdio: 'pipe' });
    log('✅ PM2: Application restarted with rollback version');
    
    // Verify rollback deployment
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    const status = execSync('pm2 jlist', { encoding: 'utf8' });
    const appList = JSON.parse(status);
    const appInfo = appList.find(app => app.name === 'araw-dashboard');
    
    if (appInfo && appInfo.pm2_env.status === 'online') {
      log('🎉 Rollback completed successfully!');
      return { success: true, message: `Rolled back to ${lastGood.commit.substring(0, 7)}` };
    } else {
      throw new Error('Application failed to start after rollback');
    }
    
  } catch (error) {
    log(`❌ Rollback failed: ${error.message}`);
    
    // Last resort: try to restart whatever is there
    try {
      execSync('pm2 restart araw-dashboard', { stdio: 'pipe' });
      log('🆘 Emergency restart attempted');
    } catch (emergencyError) {
      log(`💥 Emergency restart failed: ${emergencyError.message}`);
    }
    
    return { success: false, message: error.message };
  }
}

// Health check function
async function healthCheck(maxRetries = 3, retryDelay = 3000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await new Promise((resolve, reject) => {
        const req = require('http').get('http://localhost:3000/api/dashboard/kpis', (res) => {
          resolve({ statusCode: res.statusCode });
        });
        req.on('error', reject);
        req.setTimeout(5000, () => reject(new Error('Timeout')));
      });
      
      if (response.statusCode === 200) {
        return true;
      }
    } catch (error) {
      log(`🏥 Health check attempt ${i + 1}/${maxRetries} failed: ${error.message}`);
    }
    
    if (i < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  return false;
}

// Enhanced deploy function with rollback
async function deploy() {
  log('🚀 Starting auto-deployment...');
  
  // Save current state before deployment
  const previousState = saveCurrentState();
  
  try {
    // Change to project directory
    process.chdir(PROJECT_DIR);
    log(`📁 Changed to directory: ${PROJECT_DIR}`);
    
    // Fetch and show what we're deploying
    execSync('git fetch origin', { stdio: 'pipe' });
    const newCommit = execSync('git rev-parse origin/qa', { encoding: 'utf8' }).trim();
    log(`🎯 Deploying commit: ${newCommit.substring(0, 7)}`);
    
    // Pull latest changes from qa branch
    execSync('git reset --hard origin/qa', { stdio: 'pipe' });
    log('✅ Git: Pulled latest changes from qa branch');
    
    // Check if package.json changed
    let packageChanged = false;
    try {
      const diffOutput = execSync('git diff HEAD~1 HEAD --name-only', { encoding: 'utf8' });
      packageChanged = diffOutput.includes('package.json') || diffOutput.includes('package-lock.json');
    } catch (diffError) {
      log('⚠️  Could not check package changes, installing dependencies anyway');
      packageChanged = true;
    }
    
    // Install dependencies if needed
    if (packageChanged) {
      execSync('npm ci --only=production', { stdio: 'pipe' });
      log('✅ NPM: Dependencies updated');
    } else {
      log('ℹ️  NPM: No dependency changes detected');
    }
    
    // Build the application
    execSync('npm run build', { stdio: 'pipe' });
    log('✅ Build: Application built successfully');
    
    // Restart PM2 application
    execSync('pm2 restart araw-dashboard', { stdio: 'pipe' });
    log('✅ PM2: Application restarted');
    
    // Enhanced health check
    log('🏥 Performing health check...');
    const isHealthy = await healthCheck();
    
    if (!isHealthy) {
      throw new Error('Health check failed - application not responding correctly');
    }
    
    // Verify PM2 status
    const status = execSync('pm2 jlist', { encoding: 'utf8' });
    const appList = JSON.parse(status);
    const appInfo = appList.find(app => app.name === 'araw-dashboard');
    
    if (!appInfo || appInfo.pm2_env.status !== 'online') {
      throw new Error('PM2 shows application is not online');
    }
    
    log('🎉 Deployment completed successfully!');
    return { success: true, message: 'Deployment completed successfully', commit: newCommit.substring(0, 7) };
    
  } catch (error) {
    log(`❌ Deployment failed: ${error.message}`);
    
    // Automatic rollback
    if (previousState) {
      log('🔄 Attempting automatic rollback...');
      const rollbackResult = await performRollback(`Deployment failed: ${error.message}`);
      
      if (rollbackResult.success) {
        return { 
          success: false, 
          message: `Deployment failed but rollback successful: ${error.message}`,
          rollback: true,
          rollbackCommit: previousState.commit.substring(0, 7)
        };
      } else {
        return { 
          success: false, 
          message: `Deployment failed AND rollback failed: ${error.message}`,
          rollback: false
        };
      }
    } else {
      // No previous state, just try to restart
      try {
        execSync('pm2 restart araw-dashboard', { stdio: 'pipe' });
        log('🔄 Attempted emergency restart');
      } catch (restartError) {
        log(`❌ Emergency restart failed: ${restartError.message}`);
      }
      
      return { success: false, message: error.message, rollback: false };
    }
  }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Hub-Signature-256');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Health check endpoint
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'healthy', 
      service: 'araw-qa-webhook',
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  // Manual rollback endpoint
  if (req.method === 'POST' && req.url === '/rollback') {
    try {
      const rollbackResult = await performRollback('Manual rollback requested');
      
      res.writeHead(rollbackResult.success ? 200 : 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rollbackResult));
    } catch (error) {
      log(`❌ Manual rollback error: ${error.message}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Manual rollback failed', message: error.message }));
    }
    return;
  }
  
  // Status endpoint
  if (req.method === 'GET' && req.url === '/status') {
    try {
      const lastGood = loadLastKnownGood();
      const currentCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
      const pm2Status = execSync('pm2 jlist', { encoding: 'utf8' });
      const appList = JSON.parse(pm2Status);
      const appInfo = appList.find(app => app.name === 'araw-dashboard');
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        current: {
          commit: currentCommit.substring(0, 7),
          fullCommit: currentCommit,
          branch: currentBranch
        },
        lastKnownGood: lastGood ? {
          commit: lastGood.commit.substring(0, 7),
          fullCommit: lastGood.commit,
          timestamp: lastGood.timestamp
        } : null,
        pm2Status: appInfo ? {
          status: appInfo.pm2_env.status,
          pid: appInfo.pid,
          uptime: appInfo.pm2_env.pm_uptime,
          memory: appInfo.monit.memory,
          cpu: appInfo.monit.cpu
        } : null,
        service: 'araw-qa-webhook',
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to get status', message: error.message }));
    }
    return;
  }
  
  // Only accept POST requests to /webhook
  if (req.method !== 'POST' || req.url !== '/webhook') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }
  
  let body = '';
  
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', async () => {
    try {
      // Verify signature
      const signature = req.headers['x-hub-signature-256'];
      if (!signature || !verifySignature(body, signature)) {
        log('🔒 Webhook: Invalid signature');
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid signature' }));
        return;
      }
      
      // Parse webhook payload
      const payload = JSON.parse(body);
      
      // Check if this is a push to qa branch
      if (payload.ref !== 'refs/heads/qa') {
        log(`📝 Webhook: Ignoring push to ${payload.ref}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Ignored: Not qa branch' }));
        return;
      }
      
      log(`🔔 Webhook: Received push to qa branch from ${payload.pusher.name}`);
      log(`📝 Commits: ${payload.commits.length} new commits`);
      
      // Deploy
      const result = await deploy();
      
      res.writeHead(result.success ? 200 : 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
      
    } catch (error) {
      log(`❌ Webhook error: ${error.message}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  });
});

// Start server
server.listen(PORT, () => {
  log(`🌐 ARAW QA Auto-Deploy Webhook Server running on port ${PORT}`);
  log(`🔗 Webhook URL: http://araw-qa.ncience.com:${PORT}/webhook`);
  log(`🏥 Health check: http://araw-qa.ncience.com:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  log('📡 Received SIGTERM, shutting down gracefully');
  server.close(() => {
    log('🔴 Webhook server stopped');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  log('📡 Received SIGINT, shutting down gracefully');
  server.close(() => {
    log('🔴 Webhook server stopped');
    process.exit(0);
  });
});
