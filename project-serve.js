/* @vandeurenglenn/project version 0.2.0 */
'use strict';

const ENVIRONMENT = {version: '0.2.0', production: true};

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
require('koa-mount');
var serve = _interopDefault(require('koa-static'));
var open = _interopDefault(require('open'));
var path = require('path');

var projectServe = (path$$1 = 'www', port = 3000) => {
  const server = new Koa();
  console.log(path.join(process.cwd(), path$$1));
  server.use(serve(path.join(process.cwd(), path$$1)));
  
  server.listen(port);
  
  open(`http://127.0.0.1:${port}`);
}

module.exports = projectServe;
