var modelsManager = require('./../managers/models-manager');

var Client = require('node-xmpp-client');

var Constructor = function (address, port) {
	this._address = address;
	this._port = port;
	this._credentials = {
		user: 'dummy-echo',
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
	var self = this;

	this._connection = new Client({
		websocket: { url: 'ws://' + this._address + ':' + this._port },
		jid: this._credentials.user + '@localhost',
		password: this._credentials.password
	});

	this._connection.on('online', function () {
		console.log('-------- DUMMY ECHO: ONLINE! --------');
	});

	this._connection.on('stanza', function (stanza) {
		console.log('DUMMY ECHO: stanza', stanza.root().toString());
	});

	setInterval(function () {
		self._connection.send('<message to="profile-manager@localhost"><body>Are you there?</body></message>');
		self._connection.send('<message to="localhost"><body>Echo!</body></message>');
	}, 15 * 1000);
};

module.exports = Constructor;