var mock = require('mock-require');

var Constructor = function () {};

Constructor.prototype.notify = function (stanza) {};

mock('./../../../../src/server/components/xmpp/messenger', Constructor);

module.exports = Constructor;
