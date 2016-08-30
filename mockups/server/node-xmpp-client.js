var EventEmitter = require('events').EventEmitter;
var util = require('util');
var mock = require('mock-require');
var _instance;

function Constructor() {
	this.options = {};
	_instance = this;
}
util.inherits(Constructor, EventEmitter);

Constructor.prototype.connect = function () {};

Constructor.prototype.send = function () {};

Constructor.prototype.end = function () {};

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('node-xmpp-client', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('node-xmpp-client');
};

module.exports = Constructor;
