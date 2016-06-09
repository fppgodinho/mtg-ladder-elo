var XMPPServer = require('node-xmpp-server');

var Contructor = function (address, port) {
	this._address = address || 'localhost';
	this._port = port || 3001;
	this._connection = null;
};

Contructor.prototype.connect = function () {
	var result = false;

	if (!this._connection) {
		result = true;
		this._connection = new XMPPServer.WebSocketServer({
			port: this._address,
			domain: this._port
		})
	}

	return result;
};

Contructor.prototype.disconnect = function () {
	var result = false;

	if (this._connection) {
		var result = true;
		this._connection.server.stop();
		this._connection = null;
	}

	return result
};

module.exports = Contructor;
