var util = require('util');
var when = require('when');

var EventEmitter = require('events');

var ConnectionEvent = require('./connection-event');
var ConnectionState = require('./connection-state');
var ConnectionError = require('./connection-error');

var Constructor = function () {
	this._state = ConnectionState.OFFLINE;
};
util.inherits(Constructor, EventEmitter);

Constructor.prototype.events = ConnectionEvent;
Constructor.prototype.states = ConnectionState;
Constructor.prototype.errors = ConnectionError;

Constructor.prototype._setState = function (to) {
	if (to != this._state) {
		var from = this._state;
		this._state = to;
		this.emit(ConnectionEvent.STATE_CHANGED, to, from);
	}
};

Constructor.prototype.getState = function () {
	return this._state;
};

Constructor.prototype.setup = function () {};

Constructor.prototype.connect = function () {
	this._setState(ConnectionState.CONNECTING);
	this._setState(ConnectionState.ONLINE);

	return when.resolve();
};

Constructor.prototype.disconnect = function () {
	this._setState(ConnectionState.DISCONNECTING);
	this._setState(ConnectionState.OFFLINE);

	return when.resolve();
};

Constructor.prototype.send = function (data) {

};

module.exports = Constructor;