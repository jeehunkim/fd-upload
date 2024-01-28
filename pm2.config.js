module.exports = {
    apps: [{
        name: 'upload',
        script: 'npm',
        args: 'start:dev',
        autorestart: true,
        watch: true,
        // instances: 0,
        exec_mode: 'folk'
    }]
}

//   pm2 start pm2.config.js