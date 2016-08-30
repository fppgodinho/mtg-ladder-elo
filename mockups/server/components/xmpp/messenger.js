var mock = require('mock-require');

var Constructor = function () {};

Constructor.prototype.notify = function (stanza) {};

Constructor.mockStart = function () {
	mock('./../../../../src/server/components/xmpp/messenger', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/server/components/xmpp/messenger');
};

module.exports = Constructor;
