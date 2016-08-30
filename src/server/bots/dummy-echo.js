var modelsManager = require('./../managers/models-manager');

var Client = require('node-xmpp-client');
var credentials = require('./credentials/dummy-user');

var Constructor = function (address, port) {
	this._address = address;
	this._port = port;
	this._users = null;
	this._connection = null;
	this._online = false;
};

Constructor.prototype.isOnline = function () {
	return this._online;
};

Constructor.prototype.connect = function () {
	this._initializeModels();
};

Constructor.prototype._initializeModels = function () {
	this._users = modelsManager.get('users');

	this._users.findOrCreate({user: credentials.user}, credentials)
		.then(this._initializeConnection.bind(this));
};

Constructor.prototype._initializeConnection = function () {
	var self = this;

	this._connection = new Client({
		websocket: { url: 'ws://' + this._address + ':' + this._port },
		jid: credentials.user + '@localhost',
		password: credentials.password
	});

	this._connection.on('online', function () {
		self._online = true;
	});

	this._connection.on('stanza', function (stanza) {
		if (stanza) {
			console.log('DUMMY ECHO: stanza', stanza.root().toString());
		}
	});
};

module.exports = Constructor;