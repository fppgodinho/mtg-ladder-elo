var EventEmitter = require('events').EventEmitter;
var util = require('util');
var mock = require('mock-require');

var MockUpInstance = function () {
	this.server = {
		stop: function () {}
	}
};
util.inherits(MockUpInstance, EventEmitter);

var instance = new MockUpInstance();

var mockup = {
	WebSocketServer: function () {
		return instance;
	}
};
mock('node-xmpp-server', mockup);

module.exports = instance;
