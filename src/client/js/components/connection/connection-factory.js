var ConnectionXMPP = require('./connection-xmpp');

var Constructor = function () {};

Constructor.prototype.createXMP = function (connectionType, protocol, address, port, username, password) {
	var connection = new ConnectionXMPP();
	connection.setup(connectionType, protocol, address, port, username, password);
	return connection;
};
module.exports = new Constructor();
