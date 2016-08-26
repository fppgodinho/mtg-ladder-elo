var util = require('util');

var Buffer = require('buffer').Buffer;
var EventEmitter = require('events');
var Client = require('node-xmpp-client');

var XMPPWebsocketConnection = require('./xmpp-websocket-connection');
var ConnectionEvent = require('./connection-event');
var ConnectionState = require('./connection-state');
var ConnectionError = require('./connection-error');

var Constructor = function () {
	this._connection = new XMPPWebsocketConnection();
	this._connection.on(ConnectionEvent.ERROR, this._handleOnError.bind(this));
	this._connection.on(ConnectionEvent.STATE_CHANGED, this._handleOnStateChange.bind(this));
	this._connection.on(ConnectionEvent.ERROR, this._handleOnMessage.bind(this));
	this._connection.setup('ws', 'localhost', 3001, true, 2 * 1000);

	// this._debug();
};
util.inherits(Constructor, EventEmitter);

Constructor.prototype._handleOnError = function (error) {
	console.log('XMPP-Service::_handleOnError', error);
	this.emit(ConnectionEvent.ERROR, error);
};
Constructor.prototype._handleOnStateChange = function (to, from) {
	console.log('XMPP-Service::_handleOnStateChange', to, from);
	this.emit(ConnectionEvent.STATE_CHANGED, to, from);
};
Constructor.prototype._handleOnMessage = function (message) {
	console.log('XMPP-Service::_handleOnMessage', message);
	this.emit(ConnectionEvent.MESSAGE, message);
};

Constructor.prototype.login = function (username, password) {
	return this._connection.connect(username, password);
};

Constructor.prototype.logout = function () {
	return this._connection.disconnect();
};


Constructor.prototype.register = function (username, password) {
	// if (this._connection.isConnected()) {
	// 	this._connection.send(stanza.createRegister(username, password));
	// }
};

Constructor.prototype.send = function (message) {
	// if (this._connection.isConnected()) {
	// 	this._connection.send(stanza.createMessage(message));
	// }
};

Constructor.prototype.events = ConnectionEvent;
Constructor.prototype.states = ConnectionState;
Constructor.prototype.errors = ConnectionError;

Constructor.prototype._debug = function () {
	var dummy = new Client({
		websocket: { url: 'ws://localhost:3001'},
		jid: 'user@localhost',
		password: 'password'
	});
};

module.exports = Constructor;
