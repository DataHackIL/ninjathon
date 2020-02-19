const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const express = require('express')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const { homepage: prefix } = require('./package.json')

app.prepare().then(() => {
  const server = express();

  // The rewire middleware - not. req.url is mutable but req.originalUrl isn't, or at least has no effect if mutated
  server.use(function(req, res, next) {
     req.url = req.originalUrl.replace(prefix + '/_next', '_next');
     console.log(req.originalUrl, req.url)
     next(); // be sure to let the next middleware handle the modified request.
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})