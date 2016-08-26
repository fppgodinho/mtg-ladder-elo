var EventEmitter = require('events').EventEmitter;
var util = require('util');
var mock = require('mock-require');
var instance;

var MockUpInstance = function () {
};
util.inherits(MockUpInstance, EventEmitter);

MockUpInstance.prototype.use = function () {};

MockUpInstance.prototype.listen = function (port, callback) {
	callback();
};

MockUpInstance.prototype.close = function () {};

function mockup () {
	instance = new MockUpInstance();
	return instance;
};
mockup.static = function () {};

mock('express', mockup);

module.exports = {
	getInstance: function () {
		return instance;
	}
};
