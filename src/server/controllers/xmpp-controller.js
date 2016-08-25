var servicesManager = require('./../managers/services-manager');
var componentsManager = require('./../managers/components-manager');
var botsManager = require('./../managers/bots-manager');

var XMPPServer = require('node-xmpp-server');
var MessengerComponent = require('./../components/xmpp/messenger');
var ProfileManagerBot = require('./../bots/profile-manager');
var DummyEchoBot = require('./../bots/dummy-echo');

var Constructor = function (address, port) {
	this._address = address || 'localhost';
	this._port = port || 3001;
	this._connection = null;
	this._messenger = null;

	this._dummyEchoBot = botsManager.set('dummy-echo', new DummyEchoBot(this._address, this._port));
	this._profileManagerBot = botsManager.set('profile-manager', new ProfileManagerBot(this._address, this._port));

	this._addEventsToClientHandler = this._addEventsToClient.bind(this);
	this._authenticationService = servicesManager.get('authentication');
};

Constructor.prototype.connect = function () {
	var result = false;

	if (!this._connection) {
		result = true;
		this._connection = new XMPPServer.WebSocketServer({
			port: this._port,
			host: this._address
		});

		this._messenger = componentsManager.set('messenger', new MessengerComponent(this._connection.connections));

		this._profileManagerBot.connect();

		this._connection.on('connection', this._addEventsToClientHandler);
		// console.log('-------- SERVING XMPP WEBSOCKET --------');
	}

	return result;
};

Constructor.prototype.disconnect = function () {
	var result = false;

	if (this._connection) {
		result = true;
		this._connection.removeListener('connection', this._addEventsToClientHandler);
		this._connection.server.stop();
		this._connection = null;
	}

	return result;
};

Constructor.prototype._addEventsToClient = function (client) {
	var self = this;

	// console.log('XMPP CLIENT CONNECTED:', client.connection.socket.socket.upgradeReq.connection.remoteAddress);

	client.on('authenticate', function (opts, callback) {
		self._handleClientAuthentication(client, opts, callback);
	});
	client.on('register', function (opts, callback) {
		self._handleClientRegister(client, opts, callback);
	});
	client.on('online', function () {
		self._handleClientOnline(client);
	});
	client.on('stanza', function (stanza) {
		self._handleClientStanza(client, stanza);
	});
	client.on('disconnect', function () {
		self._handleClientDisconnect(client);
	});
};

Constructor.prototype._handleClientAuthentication = function (client, opts, callback) {
	this._authenticationService.validate(opts.username, opts.password, function (error) {
		if (error) {
			// console.log('XMPP CLIENT AUTHENTICATION ERROR:', opts.username);
			callback(false);
		} else {
			// console.log('XMPP CLIENT AUTHENTICATION SUCCESS:', opts.username);
			callback(null, opts);
			// client.send('<message to="profile-manager@localhost" ><body>Who are you</body></message>');
			// client.send('<message to="' + opts.username + '@localhost" ><body>Who are you</body></message>');
		}
	});
};

Constructor.prototype._handleClientRegister = function (client, opts, callback) {
	// console.log('XMPP CLIENT REGISTRATION SUCCESS:', opts.username);
	callback(true);
};

Constructor.prototype._handleClientOnline = function (client) {
	// console.log('XMPP CLIENT ONLINE:', client.jid.toString());
};

Constructor.prototype._handleClientStanza = function (client, stanza) {
	//console.log('XMPP CLIENT STANZA:', client.jid.toString(), stanza.name, stanza.attrs.from, stanza.attrs.to, stanza.attrs.id);

	this._messenger.notify(stanza);
};

Constructor.prototype._handleClientDisconnect = function (client) {
	// console.log('XMPP CLIENT DISCONNECTED:', client.jid?client.jid.toString():'guest');
};

module.exports = Constructor;
