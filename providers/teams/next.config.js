module.exports = {
    assetPrefix: '/teams',
    webpack: config => {
        config.resolve.alias['@shared'] = require('path').resolve(__dirname + '/../shared')
        return config
    },
}
