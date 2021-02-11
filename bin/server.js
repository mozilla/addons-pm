const { createServer } = require('http');
const { parse } = require('url');
const fs = require('fs');

const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen('/tmp/nginx.socket', (err) => {
    if (err) {
      throw err;
    }
    // eslint-disable-next-line no-console
    console.log('Add-ons PM NextJS Server is running');
    fs.openSync('/tmp/app-initialized', 'w');
  });
});
