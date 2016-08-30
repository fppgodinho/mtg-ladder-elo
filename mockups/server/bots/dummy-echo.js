var mock = require('mock-require');

var Constructor = function () {};

Constructor.prototype.connect = function () {};


Constructor.mockStart = function () {
	mock('./../../../src/server/bots/profile-manager', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../src/server/bots/profile-manager');
};


module.exports = Constructor;
