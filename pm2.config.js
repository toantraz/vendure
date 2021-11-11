module.exports = [{
  script: 'node node_modules/\@vendure/server/dist/index.js',
  name: 'server',
  instances: 1,
  autorestart: true,
  watch: false,
  max_memory_restart: '4G'
}, {
  script: 'node node_modules/\@vendure/server/dist/index-worker.js',
  name: 'worker',
  instances: 1,
  autorestart: true,
  watch: false,
  max_memory_restart: '2G'
}]
