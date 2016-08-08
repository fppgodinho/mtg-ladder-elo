var EventEmitter = require('events');
var util = require('util');
var connectionFactory = require('./connection-factory');
var ConnectionXMPP = require('./connection-xmpp');
var ConnectionBase = require('./connection-base');

var Constructor = function () {
	this._busy = false;
	this._connected = false;
	this._connection = connectionFactory.createXMP(ConnectionXMPP.WEBSOCKET, 'ws', 'localhost', 3001, 'user', 'password');
	this._connection.on(ConnectionBase.CONNECTED, this._handleConnected.bind(this));
	this._connection.on(ConnectionBase.DISCONNECTED, this._handleDisconnected.bind(this));
	this._connection.on(ConnectionBase.ERROR, this._handleError.bind(this));

};
util.inherits(Constructor, EventEmitter);

Constructor.ALREADY_CONNECTED = 'alreadyConnected';
Constructor.BUSY = 'Busy';
Constructor.CONNECTED = 'Connected';
Constructor.DISCONNECTED = 'disconnected';
Constructor.ERROR = 'Error';
Constructor.NOT_CONNECTED = 'notDisconnected';
Constructor.READY = 'Ready';

Constructor.prototype._handleConnected = function () {
	this._busy = false;
	this._connected = true;
	this.emit(Constructor.CONNECTED);
	this.emit(Constructor.READY);
};

Constructor.prototype._handleError = function (error) {
	this.emit(Constructor.ERROR, error);
};

Constructor.prototype.connect = function () {
	if (this._busy) {
		this.once(Constructor.READY, this.connect.bind(this));
	} else if (this._connected) {
		this.emit(Constructor.ALREADY_CONNECTED);
	} else {
		this._busy = true;
		this.emit(Constructor.BUSY);
		this._connection.connect();
	}
};

Constructor.prototype.disconnect = function () {
	if (this._busy) {
		this.once(Constructor.READY, this.disconnect.bind(this));
	} else if (!this._connected) {
		this.emit(Constructor.NOT_CONNECTED);
	} else {
		this._busy = true;
		this.emit(Constructor.BUSY);
		this._connection.disconnect();
	}
};

Constructor.prototype._handleDisconnected = function () {
	this._connected = false;
	this.emit(Constructor.DISCONNECTED);
	this.emit(Constructor.READY);
};

module.exports = Constructor;
