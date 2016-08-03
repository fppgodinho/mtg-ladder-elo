var XMPPServer = require('node-xmpp-server');
var Waterline = require('waterline');
var diskAdapter = require('sails-disk');

var Constructor = function (address, port, callback) {
	this._address = address || 'localhost';
	this._port = port || 3001;
	this._connection = null;
	this._addEventsToClientHandler = this._addEventsToClient.bind(this);
	this._waterline = new Waterline();
	this._userCollection = Waterline.Collection.extend({
		identity: 'user',
		connection: 'default',
		attributes: {
			user: 'string',
			password: 'string'
		}
	});
	this._waterline.loadCollection(this._userCollection);
	this._config = {
		adapters: {
			'disk': diskAdapter
		},

		connections: {
			default: {
				adapter: 'disk',
				filePath: 'data/'
			}
		}
	};

	this._connectToDB(function () {
		
	});
};

Constructor.prototype._connectToDB = function (callback) {
	this._waterline.initialize(this._config, function (err, ontology) {
		var self = this;

		this._userModel = ontology.collections.user;
		this._userModel.findOne({user: 'user'}).then(function (user) {
			return user || self._userModel.create({user: 'user', password: 'password'});
		}).then(callback);
	});
};

Constructor.prototype.connect = function () {
	var result = false;

	if (!this._connection) {
		result = true;
		this._connection = new XMPPServer.WebSocketServer({
			port: this._address,
			domain: this._port
		});

		this._connection.once('connection', this._addEventsToClientHandler);
		console.log('-------- SERVING XMPP WEBSOCKET --------');
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

	console.log('XMPP CLIENT CONNECTED:', client.connection.socket.socket.upgradeReq.connection.remoteAddress);

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
		self._handleClientDisconnect(client, stanza);
	});
};

Constructor.prototype._handleClientAuthentication = function (client, opts, callback) {
	if (opts.password === 'password') {
		console.log('XMPP CLIENT AUTHENTICATION SUCCESS:', opts.username);
		callback(null, opts);
	} else {
		console.log('XMPP CLIENT AUTHENTICATION ERROR:', opts.username);
		callback(false);
	}
};
Constructor.prototype._handleClientRegister = function (client, opts, callback) {
	console.log('XMPP CLIENT AUTHENTICATION SUCCESS:', opts.username);
	callback(true);
};
Constructor.prototype._handleClientOnline = function (client) {
	console.log('XMPP CLIENT ONLINE:', client.jid.toString());
};
Constructor.prototype._handleClientStanza = function (client, stanza) {
	console.log('XMPP CLIENT STANZA:', client.jid.toString(), stanza);
};
Constructor.prototype._handleClientDisconnect = function () {
	console.log('XMPP CLIENT DISCONNECTED:', client.jid.toString());
};


module.exports = Constructor;
