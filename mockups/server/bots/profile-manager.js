var mock = require('mock-require');

var Constructor = function () {};

Constructor.prototype.connect = function () {};

mock('./../../../src/server/bots/profile-manager', Constructor);

module.exports = Constructor;
