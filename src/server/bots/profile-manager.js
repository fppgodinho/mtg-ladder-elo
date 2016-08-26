var modelsManager = require('./../managers/models-manager');

var JID = require('node-xmpp-core').JID;
var ltx = require('node-xmpp-core').stanza.ltx;
var Client = require('node-xmpp-client');

var Constructor = function (address, port) {
	this._address = address;
	this._port = port;
	this._credentials = {
		user: 'profile-manager',
		password: 'password',
		type: 'bot'
	};
	this._users = null;
	this._connection = null;
};

Constructor.prototype.connect = function () {
	this._initializeModels();
}

Constructor.prototype._initializeModels = function () {
	this._users = modelsManager.get('users');

	this._users.findOrCreate({user: this._credentials.user}, this._credentials)
		.then(this._initializeConnection.bind(this));
};

Constructor.prototype._initializeConnection = function () {
	this._connection = new Client({
		websocket: { url: 'ws://' + this._address + ':' + this._port },
		jid: this._credentials.user + '@localhost',
		password: this._credentials.password
	});

	this._connection.on('online', function () {
		console.log('-------- PROFILE BOT: ONLINE! --------');
	});

	this._connection.on('stanza', this._handleStanza.bind(this));
};

Constructor.prototype._handleStanza = function (stanza) {
	var from = new JID(stanza.attrs.from);
	var self = this;

	this._users.findOne({user: from.local}).then(function (data) {
		var profile = self._sanitizeProfile(data);
		var message =
			'<iq id="' + stanza.attrs.id + '" to="' + stanza.from + '" type="result">' +
			'<query xmlns="urn:ietf:params:xml:ns:profile">' +
			JSON.stringify(profile) +
			'</query>' +
			'</iq>';

		stanza = ltx.parse(message)
		self._connection.send(stanza);
	});
};

Constructor.prototype._sanitizeProfile = function (profile) {
	delete profile.password;
	return profile;
};

module.exports = Constructor;