var modelsManager = require('./../managers/models-manager');

var JID = require('node-xmpp-core').JID;
var ltx = require('node-xmpp-core').stanza.ltx;
var Client = require('node-xmpp-client');
var credentials = require('./credentials/profile-user');

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
			self._handleStanza(stanza);
		}
	});
};

Constructor.prototype._handleStanza = function (stanza) {
	var from = new JID(stanza.attrs.from);
	var self = this;

	this._users.findOne({user: from.local}).then(function (data) {
		if (data) {
			self._sendResultStanza(stanza.attrs.id, stanza.from, data);
		} else {
			self._sendErrorStanza(stanza.attrs.id, stanza.from);
		}
	}).catch(function () {
		self._sendErrorStanza(stanza.attrs.id, stanza.from);
	});
};

Constructor.prototype._sendResultStanza = function (id, from, data) {
	var profile = this._sanitizeProfile(data);
	var message =
		'<iq id="' + id + '" to="' + from + '" type="result">' +
		'<query xmlns="urn:ietf:params:xml:ns:profile">' +
		JSON.stringify(profile) +
		'</query>' +
		'</iq>';

	var stanza = ltx.parse(message);
	this._connection.send(stanza);
};

Constructor.prototype._sanitizeProfile = function (profile) {
	delete profile.password;
	return profile;
};

Constructor.prototype._sendErrorStanza = function (id, from) {
	var message =
		'<iq id="' + id + '" to="' + from + '" type="error">' +
		'<query xmlns="urn:ietf:params:xml:ns:profile">' +
		'Meh no such profile!' +
		'</query>' +
		'</iq>';

	var stanza = ltx.parse(message);
	this._connection.send(stanza);
};

module.exports = Constructor;