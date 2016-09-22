var mock = require('mock-require');

var Constructor = function () {
};

Constructor.mockStart = function () {
	mock('./../../../src/server/services/authentication-service', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../src/server/services/authentication-service');
};

module.exports = Constructor;
