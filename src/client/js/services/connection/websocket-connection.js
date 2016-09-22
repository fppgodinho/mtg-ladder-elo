var util = require('util');
var when = require('when');

var WebSocket = window.WebSocket;

var Connection = require('./connection');
var ConnectionEvent = require('./connection-event');
var ConnectionState = require('./connection-state');
var ConnectionError = require('./connection-error');

var Constructor = function () {
	this._state = ConnectionState.OFFLINE;
};
util.inherits(Constructor, Connection);

Constructor.prototype.setup = function (protocol, address, port, reconnect, delay) {
	this._disconected = false;

	this._deferredRequest = null;
	this._protocol = protocol;
	this._address = address;
	this._port = port;
	this._reconnect = !!reconnect;
	this._delay = delay;

	this._url = this._protocol + '://' + this._address + (this._port?(':' + this._port):'');

	this._timeout = null;

	return when.resolve();
};

Constructor.prototype.connect = function () {
	var defered = when.defer();

	if (this.isBusy()) {
		defered.reject(ConnectionError.BUSY);
	} else if (this.isOnline()) {
		defered.reject(ConnectionError.ALREADY_CONNECTED);
	} else {
		this._disconected = false;
		this._deferredRequest = defered;
		this._setState(ConnectionState.CONNECTING);
		this._createWebSocket();
	}

	return defered.promise;
};

Constructor.prototype.isBusy = function () {
	return this._state === ConnectionState.CONNECTING || this._state === ConnectionState.DISCONNECTING;
};

Constructor.prototype.isOnline = function () {
	return this._state === ConnectionState.ONLINE;
};

Constructor.prototype._createWebSocket = function () {
	this._webSocket = new WebSocket(this._url);
	this._webSocket.onopen = this._handleOnOpen.bind(this);
	this._webSocket.onclose = this._handleOnClose.bind(this);
	this._webSocket.onerror = this._handleOnError.bind(this);
	this._webSocket.onmessage = this._handleOnMessage.bind(this);
};

Constructor.prototype._handleOnOpen = function () {
	var defered = this._deferredRequest;
	this._deferredRequest = null;

	defered.resolve();
	this._setState(ConnectionState.ONLINE);
};

Constructor.prototype._handleOnClose = function () {
	this._destroyWebSocket();

	if (!this._reconnect || this._disconected) {
		var defered = this._deferredRequest;
		this._deferredRequest = null;

		defered.resolve();
		this._setState(ConnectionState.OFFLINE);
	} else {
		this._deferredRequest = this._deferredRequest || when.defer();
		this._setState(ConnectionState.CONNECTING);
		setTimeout(this._createWebSocket.bind(this), this._delay);
	}
};

Constructor.prototype._handleOnError = function (error) {
	this._destroyWebSocket();

	if (!this._reconnect) {
		var defered = this._deferredRequest;
		this._deferredRequest = null;

		defered.reject(ConnectionEvent.ERROR);
		this.emit(ConnectionEvent.ERROR, error);
		this._setState(ConnectionState.OFFLINE);
	} else {
		this._setState(ConnectionState.CONNECTING);
		this._timeout = setTimeout(this._createWebSocket.bind(this), this._delay);
	}
};

Constructor.prototype._handleOnMessage = function (message) {
	this.emit(ConnectionEvent.MESSAGE, message);
};

Constructor.prototype.disconnect = function () {
	var defered = when.defer();

	if (this._state === ConnectionState.CONNECTING) {
		this._disconected = true;
		clearTimeout(this._timeout);
		this._destroyWebSocket();
		this._setState(ConnectionState.OFFLINE);
		defered.resolve();
	} else if (this.isBusy()) {
		defered.reject(ConnectionError.BUSY);
	} else if (!this.isOnline()) {
		defered.reject(ConnectionError.NOT_CONNECTED);
	} else {
		this._disconected = true;
		this._deferredRequest = defered;
		this._setState(ConnectionState.DISCONNECTING);
		this._webSocket.close();
	}

	return defered.promise;
};

Constructor.prototype._destroyWebSocket = function () {
	if (this._webSocket) {
		this._webSocket.onopen = null;
		this._webSocket.onclose = null;
		this._webSocket.onerror = null;
		this._webSocket.onmessage = null;
		this._webSocket = null;
	}
};

Constructor.prototype.send = function (message) {
	var defered = when.defer();

	if (this.isBusy()) {
		defered.reject(ConnectionError.BUSY);
	} else if (!this.isOnline()) {
		defered.reject(ConnectionError.NOT_CONNECTED);
	} else {
		this._webSocket.send(message);
		defered.resolve();
	}

	return defered.promise;
};

module.exports = Constructor;