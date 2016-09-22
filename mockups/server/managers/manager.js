var EventEmitter = require('events');
var util = require('util');

var Constructor = function () {};
util.inherits(Constructor, EventEmitter);

Constructor.prototype.ADDED = 'Added';
Constructor.prototype.ERROR = 'Error';

Constructor.prototype._instances = {};

Constructor.prototype.set = function (name, instance) {
	if (this._instances[name]) {
		this.emit(this.ERROR, name + ' already exists');
	} else {
		this._instances[name] = instance;
		this.emit(this.ADDED, name);
	}

	return this._instances[name];
};

Constructor.prototype.get = function (name) {
	return this._instances[name];
};

module.exports = Constructor;
