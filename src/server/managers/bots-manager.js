var EventEmitter = require('events');
var util = require('util');
var _bots = {};

var Constructor = function () {};
util.inherits(Constructor, EventEmitter);

Constructor.prototype.ADDED = 'Added';
Constructor.prototype.ERROR = 'Error';

Constructor.prototype.set = function (name, bot) {
	if (_bots[name]) {
		this.emit(this.ERROR, name + ' already exists');
	} else {
		_bots[name] = bot;
		this.emit(this.ADDED, name);
	}

	return _bots[name];
};

Constructor.prototype.get = function (name) {
	return _bots[name];
};

var instance = new Constructor();

module.exports = instance;
