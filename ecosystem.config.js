/**
 * PM2 Ecosystem Configuration
 * Copy this file to ecosystem.config.js and customize for your deployment
 * 
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 save
 *   pm2 startup
 */

module.exports = {
  apps: [
    {
      name: 'api-service',
      script: './build/server.js',
      
      // Cluster mode - use all CPU cores
      instances: 'max',
      exec_mode: 'cluster',
      
      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 5001,
      },
      
      // Environment file (optional - can also set env vars directly)
      env_file: './production.env',
      
      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Auto-restart
      autorestart: true,
      watch: false, // Set to true only for development
      
      // Memory management
      max_memory_restart: '1G',
      
      // Advanced options
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
};

