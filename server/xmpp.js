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
	if (client.connection) {
		console.log('XMPP CLIENT CONNECTED:', client.connection.socket.socket.upgradeReq.connection.remoteAddress);
	}
	client.on('register', _registerClient);
};

var _registerClient = function (opts, callback) {
	console.log('REGISTER');
	callback(true);
};

module.exports = Constructor;
