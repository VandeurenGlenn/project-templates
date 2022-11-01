/* @vandeurenglenn/project version 0.2.1 */
'use strict';

const ENVIRONMENT = {version: '0.2.1', production: true};

var Koa = require('koa');
require('koa-mount');
var serve = require('koa-static');
var open = require('open');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Koa__default = /*#__PURE__*/_interopDefaultLegacy(Koa);
var serve__default = /*#__PURE__*/_interopDefaultLegacy(serve);
var open__default = /*#__PURE__*/_interopDefaultLegacy(open);

var projectServe = (path$1 = 'www', port = 3000, host = '127.0.0.1') => {
  const server = new Koa__default['default']();

  server.use(serve__default['default'](path.join(process.cwd(), path$1)));

  const _server = server.listen(port, host);

  open__default['default'](`http://${host}:${port}`);
  return _server
};

exports.default = projectServe;
