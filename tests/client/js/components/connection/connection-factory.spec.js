var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var nodeXMPPClient = require('./../../../../../mockups/client/node-xmpp-client');
var ConnectionFactory = require('./../../../../../client/js/components/connection/connection-factory');
var ConnectionXMPP = require('./../../../../../client/js/components/connection/connection-xmpp');

chai.should();

describe('The Connection Factory', function () {
	it ('Should exist', function () {
		ConnectionFactory.should.exist;
	});

	it ('Should be singleton', function () {
		ConnectionFactory.should.be.an('object');
	});

	it ('Should implement the "createXMP" method', function () {
		ConnectionFactory.should.respondTo('createXMP');
	});

	describe('When creating xmpp connections', function () {
		var connection;

		beforeEach(function () {
			connection = ConnectionFactory.createXMP(ConnectionXMPP.WEBSOCKET, 'http', 'localhost', 3001, 'user', 'password');
		});

		afterEach(function () {
			connection = null;
		});

		it ('Should resolve with a ConnectionXMPP instance', function () {
			connection.should.be.an.instanceOf(ConnectionXMPP, 'connection is not a ConnectionXMPP');
		});

		// it ('Should connect without errors', function (done) {
		// 	connection.on(ConnectionXMPP.CONNECTED, done);
		// 	connection.connect();
		// 	nodeXMPPClient.emit('online');
		// });
	});
});