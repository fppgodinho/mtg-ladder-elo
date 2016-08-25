var EventEmitter = require('events');
var util = require('util');
var _services = {};

var Constructor = function () {};
util.inherits(Constructor, EventEmitter);

Constructor.prototype.ADDED = 'Added';
Constructor.prototype.ERROR = 'Error';

Constructor.prototype.set = function (name, service) {
	if (_services[name]) {
		this.emit(this.ERROR, name + ' already exists');
	} else {
		_services[name] = service;
		this.emit(this.ADDED, name);
	}

	return _services[name];
};

Constructor.prototype.get = function (name) {
	return _services[name];
};

var instance = new Constructor();

module.exports = instance;
