var EventEmitter = require('events');
var util = require('util');
var _templates = {};

var Constructor = function () {};
util.inherits(Constructor, EventEmitter);

Constructor.prototype.ADDED = 'Added';
Constructor.prototype.ERROR = 'Error';

Constructor.prototype.set = function (name, service) {
	if (_templates[name]) {
		this.emit(this.ERROR, name + ' already exists');
	} else {
		_templates[name] = service;
		this.emit(this.ADDED, name);
	}
};

Constructor.prototype.get = function (name) {
	return _templates[name];
};

var instance = new Constructor();

module.exports = instance;
