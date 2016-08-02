var EventEmitter = require('events');
var util = require('util');

var Constructor = function () {};
util.inherits(Constructor, EventEmitter);

Constructor.BUSY = 'Busy';
Constructor.CONNECTED = 'Connected';
Constructor.DISCONNECTED = 'Disconnected';
Constructor.ERROR = 'Error';
Constructor.ALREADY_CONNECTED = 'AlreadyConnected';
Constructor.NOT_CONNECTED = 'NotConnected';

Constructor.prototype.setup = function () {};

Constructor.prototype.connect = function (callback) {
	callback();
};

Constructor.prototype.disconnect = function (callback) {
	callback();
};

Constructor.prototype.request = function (data, callback) {
	callback();
};

module.exports = Constructor;