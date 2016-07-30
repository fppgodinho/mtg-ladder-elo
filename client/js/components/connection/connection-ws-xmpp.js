var util = require('util');
var Base = require('./connection-base');
var xmpp = require('node-xmpp-client');

var Constructor = function () {
	this._xmpp = new xmpp({
		autostart: false
	});
	this._connected = false;
	this._connecting = false;
};
util.inherits(Constructor, Base);

Constructor.NOT_CONNECTED = 'Not Connected!';

Constructor.prototype.setup = function (protocol, address, port, username, password) {
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
		this._xmpp.options.websocket = {
			url: this._protocol + '://' + this._address + ':' + this._port
		};

		this._xmpp.on('error', onError);
		this._xmpp.on('online', onOnline);
		this._xmpp.connect();
	}
};

var _handleConnectionResult = function (instance, error, onError, onOnline, connection, callback) {
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
};

var _kill = function (connection) {
	if (connection) {
		connection.end();
	}
	
};

Constructor.prototype.disconnect = function (callback) {
	if (!this._connected) {
		callback(Constructor.NOT_CONNECTED);
	} else callback();
};

Constructor.prototype.request = function (data, callback) {
	callback();
};

module.exports = Constructor;
