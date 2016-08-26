var util = require('util');

var EventEmitter = require('events');
var SessionEvent = require('./session-event');

var Constructor = function () {
	this._user = '';
};
util.inherits(Constructor, EventEmitter);

Constructor.prototype.setUser = function (user) {
	this._user = user;
	this.emit(SessionEvent.CHANGED);
};

Constructor.prototype.getUsername = function () {
	return this._user ? this._user.user : '';
};

module.exports = Constructor;