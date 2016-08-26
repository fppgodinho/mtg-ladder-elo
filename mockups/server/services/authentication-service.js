var mock = require('mock-require');

var Constructor = function () {
};

mock('./../../../src/server/services/authentication-service', Constructor);

module.exports = Constructor;
