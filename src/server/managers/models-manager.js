var EventEmitter = require('events');
var util = require('util');
var _models = {};

var Constructor = function () {};
util.inherits(Constructor, EventEmitter);

Constructor.prototype.ADDED = 'Added';
Constructor.prototype.ERROR = 'Error';

Constructor.prototype.set = function (name, service) {
	if (_models[name]) {
		this.emit(this.ERROR, name + ' already exists');
	} else {
		_models[name] = service;
		this.emit(this.ADDED, name);
	}
};

Constructor.prototype.get = function (name) {
	return _models[name];
};

var instance = new Constructor();

module.exports = instance;
