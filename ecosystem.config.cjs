module.exports = {
  apps: [{
    name: 'takeoff-info',
    script: 'dist/app.js',

    // Clustering - use all CPU cores
    instances: 'max',
    exec_mode: 'cluster',

    // Environment variables
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
    },

    // Auto-restart configuration
    watch: false,  // Don't watch files (we'll rebuild manually)
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '500M',

    // Logging
    log_file: 'logs/combined.log',
    out_file: 'logs/out.log',
    error_file: 'logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

    // Process management - works with our graceful shutdown handlers
    kill_timeout: 5000,  // 5s graceful shutdown (matches our 30s timeout)
    wait_ready: true,
    listen_timeout: 10000,

    // Health monitoring
    health_check_grace_period: 10000,
  }]
};