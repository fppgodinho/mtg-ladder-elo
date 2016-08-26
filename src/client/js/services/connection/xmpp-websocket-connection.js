var util = require('util');
var when = require('when');
var stanza = require('./xmpp/stanza');

var WebsocketConnection = require('./websocket-connection');
var ConnectionEvent = require('./connection-event');
var ConnectionState = require('./connection-state');
var ConnectionError = require('./connection-error');

var Constructor = function () {
	this._state = ConnectionState.OFFLINE;

	this._username = '';
	this._password = '';
	this._streamID = '';
	this._mechanisms = [];
	this._requests = {};
};
util.inherits(Constructor, WebsocketConnection);

Constructor.prototype.getStreamID = function () {
	return this._streamID;
};

Constructor.prototype.isBusy = function () {
	var isConnecting = (this._state === ConnectionState.CONNECTING);
	var isAuthenticating = (this._state === ConnectionState.AUTHENTICATING);
	var isDisconnecting = (this._state === ConnectionState.DISCONNECTING);

	return isConnecting || isAuthenticating || isDisconnecting;
};

Constructor.prototype.connect = function (username, password) {
	var deferred = when.defer();
	this._username = username;
	this._password = password;

	if (this.isBusy()) {
		deferred.reject(ConnectionError.BUSY);
	} else if (this.isOnline()) {
		deferred.reject(ConnectionError.ALREADY_CONNECTED);
	} else {
		this._disconected = false;
		this._deferredRequest = deferred;
		this._setState(ConnectionState.CONNECTING);
		this._createWebSocket();
	}

	return deferred.promise;
};

Constructor.prototype._handleOnOpen = function () {
	this._webSocket.onmessage = this._handleOnHandshake.bind(this);

	this._setState(ConnectionState.AUTHENTICATING);

	this._webSocket.send(stanza.createHandshake());
};

Constructor.prototype._handleOnHandshake = function (message) {
	var data = this._parseMessage(message.data);

	var stage = data.nodeName.toLowerCase();
	switch (stage) {
		case 'open':
			this._streamID = data.attributes.id;
			break;
		case 'stream:features':
			this._setupConnection(data);
			this._webSocket.send(stanza.createLogin(this._username, this._password));
			break;
		case 'success':
			this._bind();
			break;
		case 'failure':
			this._handleOnAuthentication(false);
			break;
		case 'iq':
			var id = data.getAttribute('id');
			switch (id) {
				case 'bind':
					this._openSession();
					break;
				case 'session':
					this._requestProfile();
					break;
				case 'profile':
					this._handleOnAuthentication(true, data);
					break;
				default: break;
			}
			console.log();
			break;
		default:
			console.warn('Handshake message not recognized, Stage: ' + stage + ', Data:', data);
			break;
	}
};

Constructor.prototype._parseMessage = function (message) {
	var data = document.createElement('div');
	data.innerHTML = message;

	return data.firstChild;
};

Constructor.prototype._setupConnection = function (data) {
	this._mechanisms.length = 0;
	var mechanisms = data.querySelectorAll('mechanism');

	for (var id = 0; id < mechanisms.length; id++) {
		this._mechanisms.push(mechanisms[id].textContent);
	}
};

Constructor.prototype._bind = function () {
	this._webSocket.send(stanza.createBind());
};

Constructor.prototype._openSession = function () {
	this._webSocket.send(stanza.createSession());
};

Constructor.prototype._requestProfile = function () {
	this._webSocket.send(stanza.createProfileRequest("profile"));
};

Constructor.prototype._handleOnAuthentication = function (success, data) {
	var defered = this._deferredRequest;
	this._deferredRequest = null;

	if (success) {
		this._webSocket.onmessage = this._handleOnMessage;
		this._setState(ConnectionState.ONLINE);
		defered.resolve(data);
	} else {
		this._destroyWebSocket();
		this._setState(ConnectionState.OFFLINE);
		defered.reject(ConnectionError.AUTHENTICATION_FAILED);
		if (data) {
			this.emit(ConnectionEvent.ERROR, data);
		}
	}
};

Constructor.prototype._handleOnMessage = function (message) {
	var data = this._parseMessage(message.data);

	switch (data.nodeName.toLowerCase()) {
		default:
			this.emit(ConnectionEvent.MESSAGE, data);
			break;
	}
};

Constructor.prototype.request = function (id) {
	var defered = when.defer();

	if (this.isBusy()) {
		defered.reject(ConnectionError.BUSY);
	} else if (!this.isOnline()) {
		defered.reject(ConnectionError.NOT_CONNECTED);
	} else {
		this._requests[id] = defered;
		this._webSocket.send(message);
		//defered.resolve();
	}

	return defered.promise;
};

module.exports = Constructor;