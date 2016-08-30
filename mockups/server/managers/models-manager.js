var util = require('util');
var mock = require('mock-require');

var Manager = require('./manager');

var Constructor = function () {};
util.inherits(Constructor, Manager);

Constructor.prototype.clear = function () {
	this._instances.length = 0;
};

Constructor.prototype.mockStart = function () {
	mock('./../../../src/server/managers/models-manager', instance);
};

Constructor.prototype.mockStop = function () {
	mock.stop('./../../../src/server/managers/models-manager');
};

var instance = new Constructor();

module.exports = instance;
