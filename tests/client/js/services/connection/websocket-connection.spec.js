var sinon = require('sinon');

var Connection = require('./../../../../../src/client/js/services/connection/connection');
var WebSocketConnection = require('./../../../../../src/client/js/services/connection/websocket-connection');


describe('The Websocket Connection class', function () {

	it ('Should exist', function () {
		WebSocketConnection.should.exist;
	});

	it ('Should be a "function"', function () {
		WebSocketConnection.should.be.a('function');
	});

	describe ('Aa an instance"', function () {
		var instance = null;
		var sandbox;

		beforeEach(function () {
			sandbox = sinon.sandbox.create();
			instance = new WebSocketConnection();
			instance.setup('ws', 'localhost', 3000, true, 5 * 1000);
		});

		afterEach(function () {
			sandbox.restore();
		});
		
		it ('Should inherit the "Connection" class', function () {
			instance.should.be.an.instanceof(Connection, 'instance is not a Connection');
		});
	});
});
