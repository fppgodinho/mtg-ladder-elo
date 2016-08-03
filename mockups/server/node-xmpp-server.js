var EventEmitter = require('events').EventEmitter;
var util = require('util');
var mock = require('mock-require');
var instance;

var MockUp = function () {
	this.server = {
		stop: function () {}
	}
	this.connection = {

	}
};
util.inherits(MockUp, EventEmitter);

var mockup = {
	WebSocketServer: function () {
		instance = new MockUp();

		return instance;
	}
};
mock('node-xmpp-server', mockup);

module.exports = {
	getInstance: function () {
		return instance;
	}
};
