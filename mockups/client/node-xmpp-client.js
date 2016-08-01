var EventEmitter = require('events').EventEmitter;
var util = require('util');
var mock = require('mock-require');
var instance;

function MockUpInstance() {
	this.options = {};
	this.connect = function () {};
	this.end = function () {};
}
util.inherits(MockUpInstance, EventEmitter);

var mockup = function () {
	instance = new MockUpInstance();
	return instance;
};
mock('node-xmpp-client', mockup);

module.exports = {
	getInstance: function () {
		return instance;
	}
};
