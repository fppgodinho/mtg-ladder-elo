var sinon = require('sinon');
var chai = require('chai');
var Factory = require('../../../../../client/js/components/connection/connection-factory');

chai.should();

describe('The Connection Factory', function () {
	it ('Should exist', function () {
		Factory.should.exist;
	});

	it ('Should be singleton', function () {
		Factory.should.be.an('object');
	});

	it ('Should implement the "create" method', function () {
		Factory.should.respondTo('create');
	});

	it ('Should return generate a new connection with the "create" method ', function () {
		var connection = Factory.create('ws', 'localhost', 3001);

		connection.should.be.an('object');
	});
});