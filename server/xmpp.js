var XMPPServer = require('node-xmpp-server');

var Constructor = function (address, port) {
	this._address = address || 'localhost';
	this._port = port || 3001;
	this._connection = null;
};

Constructor.prototype.connect = function () {
	var result = false;

	if (!this._connection) {
		result = true;
		this._connection = new XMPPServer.WebSocketServer({
			port: this._address,
			domain: this._port
		});

		this._connection.on('connection', _addClientEvents);

		console.log('-------- SERVING XMPP WEBSOCKET --------');
	}

	return result;
};

Constructor.prototype.disconnect = function () {
	var result = false;

	if (this._connection) {
		result = true;
		this._connection.removeListener('connection', _addClientEvents);
		this._connection.server.stop();
		this._connection = null;
	}

	return result;
};

var _addClientEvents = function (client) {
	console.log('XMPP CLIENT CONNECTED:', client.connection.socket.socket.upgradeReq.connection.remoteAddress);

	client.on('register', function (opts, callback) {
		console.log('XMPP CLIENT AUTHENTICATION SUCCESS:', opts.username);
		callback(true);
	});
	client.on('authenticate', function (opts, callback) {
		if (opts.password === 'password') {
			console.log('XMPP CLIENT AUTHENTICATION SUCCESS:', opts.username);
			callback(null, opts)
		} else {
			console.log('XMPP CLIENT AUTHENTICATION ERROR:', opts.username);
			callback(false)
		}
	});
	client.on('online', function () {
		console.log('XMPP CLIENT ONLINE:', client.jid.toString());
	});
	client.on('stanza', function (stanza) {
		console.log('XMPP CLIENT STANZA:', client.jid.toString(), stanza);
	});
	client.on('disconnect', function () {
		console.log('XMPP CLIENT DISCONNECTED:', client.jid.toString());
	});
};

module.exports = Constructor;
