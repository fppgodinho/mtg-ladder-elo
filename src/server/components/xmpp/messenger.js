var JID = require('node-xmpp-core').JID;

var Constructor = function (connections) {
	this._connections = connections;
};

Constructor.prototype.notify = function (stanza) {
	var from = new JID(stanza.attrs.from).toJSON();
	var to = new JID(stanza.attrs.to).toJSON();

	this._connections.forEach(function (connection) {
		var jid = connection.jid.toJSON();
		var notSameAsFrom = (from.local !== jid.local || from.domain !== jid.domain);
		var sameDomain = (to.domain === jid.domain);
		var sameLocal = (!to.local || to.local === jid.local);
		var sameResource = (!to.resource || to.resource === jid.resource);

		if (notSameAsFrom && sameDomain && sameLocal && sameResource) {
			connection.send(stanza.toString());
		}
	});
};

module.exports = Constructor;
