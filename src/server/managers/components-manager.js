var EventEmitter = require('events');
var util = require('util');
var _components = {};

var Constructor = function () {};
util.inherits(Constructor, EventEmitter);

Constructor.prototype.ADDED = 'Added';
Constructor.prototype.ERROR = 'Error';

Constructor.prototype.set = function (name, component) {
	if (_components[name]) {
		this.emit(this.ERROR, name + ' already exists');
	} else {
		_components[name] = component;
		this.emit(this.ADDED, name);
	}

	return _components[name];
};

Constructor.prototype.get = function (name) {
	return _components[name];
};

var instance = new Constructor();

module.exports = instance;
