module.exports = {
    webpack: config => {
        config.resolve.alias['@shared'] = require('path').resolve(__dirname + '/../shared')
        return config
    },
}
