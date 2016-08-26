var sinon = require('sinon');

var WebSocket = window.WebSocket;
var Connection = require('./../../../../../src/client/js/services/connection/connection');
var ConnectionEvent = require('./../../../../../src/client/js/services/connection/connection-event');
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

		it ('Should trigger the "' + ConnectionEvent.CONNECTED + '" event', function () {
			var spy = sandbox.spy();

			instance.on(ConnectionEvent.CONNECTED, spy);
			instance.connect();
			WebSocket.instance.onopen();
			spy.calledOnce.should.be.true;
		});

		it ('Should trigger the "' + ConnectionEvent.DISCONNECTED + '" event', function () {
			var spy = sandbox.spy();

			instance.on(ConnectionEvent.DISCONNECTED, spy);
			instance.connect();
			WebSocket.instance.onclose();
			spy.should.have.been.calledOnce;
		});

		it ('Should trigger the "' + ConnectionEvent.ERROR + '" event', function () {
			var spy = sandbox.spy();
			var expectedError = 'error message';

			instance.setup('ws', 'localhost', 3000, false);
			instance.on(ConnectionEvent.ERROR, spy);
			instance.connect();
			WebSocket.instance.onerror(expectedError);
			spy.should.have.been.calledWith(expectedError);
		});

		it ('Should trigger the "' + ConnectionEvent.MESSAGE + '" event', function () {
			var spy = sandbox.spy();
			var expectedMessage = 'expected message';

			instance.on(ConnectionEvent.MESSAGE, spy);
			instance.connect();
			WebSocket.instance.onmessage(expectedMessage);
			spy.should.have.been.calledWith(expectedMessage);
		});
	});
});
