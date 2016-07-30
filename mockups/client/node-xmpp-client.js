var EventEmitter = require('events').EventEmitter;
var util = require('util');
var mock = require('mock-require');

var MockUpInstance = function () {
	this.options = {};
	this.connect = function () {};
	this.end = function () {};
};
util.inherits(MockUpInstance, EventEmitter);

var instance = new MockUpInstance();

var mockup = function () {
	return instance;
};
mock('node-xmpp-client', mockup);

module.exports = instance;
