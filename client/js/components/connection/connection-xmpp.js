var util = require('util');
var ConnectionBase = require('./connection-base');
var xmpp = require('node-xmpp-client');

var Constructor = function () {
	this._address = null;
	this._connected = false;
	this._connecting = false;
	this._connectionType = null;
	this._password = null;
	this._port = null;
	this._protocol = null;
	this._username = null;
	this._xmpp = new xmpp({
		autostart: false
	});
};
util.inherits(Constructor, ConnectionBase);

Constructor.UNKNOWN_CONNECTION_TYPE = 'UnknownConnectionType';
Constructor.WEBSOCKET = 'WebSocket';

Constructor.prototype.setup = function (connectionType, protocol, address, port, username, password) {
	this._connectionType = connectionType;
	this._protocol = protocol;
	this._address = address;
	this._port = port;
	this._username = username;
	this._password = password;
};

Constructor.prototype.connect = function (callback) {
	var self = this;
	var onError, onOnline;

	if (this._connecting) {
		callback('Connection in progress');
	} else if (this._connected) {
		callback('Connection already open!');
	} else {
		onError = function (error) {
			_handleConnectionResult(self, error, onError, onOnline, self._xmpp, callback);
		};

		onOnline = function () {
			_handleConnectionResult(self, null, onError, onOnline, self._xmpp, callback);
		};

		this._connected = false;
		this._connecting = true;

		this._xmpp.options.jid = this._username + '@' + this._address;
		this._xmpp.options.password = this._password;
		switch (this._connectionType) {
			case Constructor.WEBSOCKET:
				_setConnectionAsWebSocket(this._xmpp, this._protocol, this._address, this._port);
				break;
			default:
				callback(Constructor.UNKNOWN_CONNECTION_TYPE);
				return;
		}

		this._xmpp.on('error', onError);
		this._xmpp.on('online', onOnline);
		this._xmpp.connect();
	}
};

function _handleConnectionResult(instance, error, onError, onOnline, connection, callback) {
	instance._connecting = false;
	instance._connected = !error;
	connection.removeListener('error', onError);
	connection.removeListener('online', onOnline);

	if (error) {
		_kill(connection);
	}

	if (typeof callback === 'function') {
		callback(error);
	}
}

function _kill(connection) {
	if (connection) {
		connection.end();
	}
	
}

function _setConnectionAsWebSocket(xmpp, protocol, address, port) {
	xmpp.options.websocket = {
		url: protocol + '://' + address + ':' + port
	};
}

Constructor.prototype.disconnect = function (callback) {
	if (!this._connected) {
		callback(ConnectionBase.NOT_CONNECTED);
	} else callback();
};

Constructor.prototype.request = function (data, callback) {
	callback();
};

module.exports = Constructor;
