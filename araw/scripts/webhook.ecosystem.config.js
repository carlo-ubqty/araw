module.exports = {
  apps: [
    {
      name: 'araw-webhook',
      script: './scripts/webhook-deploy.js',
      cwd: '/var/www/ubqty/araw',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '100M',
      env: {
        NODE_ENV: 'production',
        WEBHOOK_PORT: 3001,
        WEBHOOK_SECRET: 'araw-qa-deploy-secret-2025'
      },
      error_file: '/var/www/ubqty/araw/local/webhook-error.log',
      out_file: '/var/www/ubqty/araw/local/webhook-out.log',
      log_file: '/var/www/ubqty/araw/local/webhook-combined.log',
      time: true
    }
  ]
};
