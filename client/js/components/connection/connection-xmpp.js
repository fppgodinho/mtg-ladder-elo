var util = require('util');
var ConnectionBase = require('./connection-base');
var xmpp = require('node-xmpp-client');

var Constructor = function () {
	this._address = null;
	this._connected = false;
	this._busy = false;
	this._connectionType = null;
	this._password = null;
	this._port = null;
	this._protocol = null;
	this._username = null;
	this._xmpp = new xmpp({
		autostart: false
	});

	this._xmpp.on('online', this._handleConnected.bind(this));
	this._xmpp.on('stanza', this._handleStanza.bind(this));
	this._xmpp.on('error', this._handleError.bind(this));
};
util.inherits(Constructor, ConnectionBase);

Constructor.UNKNOWN_CONNECTION_TYPE = 'UnknownConnectionType';
Constructor.WEBSOCKET = 'WebSocket';

Constructor.prototype._handleConnected = function () {
	console.log('-------->', 'Connected');
	this._busy = false;
	this._connected = true;
	this.emit(ConnectionBase.CONNECTED);
};

Constructor.prototype._handleStanza = function (stanza) {
	console.log('-------->', 'Stanza', stanza);
};

Constructor.prototype._handleError = function (error) {
	console.log('-------->', 'Error', error);
	this._busy = false;
	this.emit(ConnectionBase.ERROR, error);
};

Constructor.prototype.setup = function (connectionType, protocol, address, port, username, password) {
	this._connectionType = connectionType;
	this._protocol = protocol;
	this._address = address;
	this._port = port;
	this._username = username;
	this._password = password;
};

Constructor.prototype.connect = function () {
	if (this._busy) {
		this.emit(ConnectionBase.ERROR, ConnectionBase.BUSY);
	} else if (this._connected) {
		this.emit(ConnectionBase.ERROR, ConnectionBase.ALREADY_CONNECTED);
	} else {
		this._connected = false;
		this._busy = true;

		this._xmpp.options.jid = this._username + '@' + this._address;
		this._xmpp.options.password = this._password;
		switch (this._connectionType) {
			case Constructor.WEBSOCKET:
				this._setConnectionAsWebSocket(this._xmpp, this._protocol, this._address, this._port);
				break;
			default:
				this.emit(ConnectionBase.ERROR, Constructor.UNKNOWN_CONNECTION_TYPE);
				return;
		}

		this._busy = true;
		console.log('Connect...');
		this._xmpp.connect();
	}
};

Constructor.prototype._setConnectionAsWebSocket = function () {
	this._xmpp.options.websocket = {
		url: this._protocol + '://' + this._address + ':' + this._port
	};
};

Constructor.prototype.disconnect = function () {
	if (this._busy) {
		this.emit(ConnectionBase.ERROR, ConnectionBase.BUSY);
	} else if (!this._connected) {
		this.emit(ConnectionBase.ERROR, ConnectionBase.NOT_CONNECTED);
	} else {
		this._connected = false;
		this._busy = false;
		this._xmpp.end();
		this.emit(ConnectionBase.DISCONNECTED);
	}
};

Constructor.prototype.request = function (data) {
	// callback();
};

module.exports = Constructor;
