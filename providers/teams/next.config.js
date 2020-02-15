module.exports = {
  assetPrefix: '/' + require('./package.json').homepage,
  webpack: config => {
    config.resolve.alias['~'] = require('path').resolve(__dirname);
    return config;
  },
}
