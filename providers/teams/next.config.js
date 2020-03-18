module.exports = {
    assetPrefix: '/teams',

    env: {
        ENDPOINT_PORT: process.env.ENDPOINT_PORT,
    },

    webpack: config => {
        config.resolve.alias['@shared'] = require('path').resolve(__dirname + '/../shared')
        return config
    },
}
