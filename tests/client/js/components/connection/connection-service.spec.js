var chai = require('chai');
var nodeXMPPClient = require('./../../../../../mockups/client/node-xmpp-client');
var ConnectionService = require('./../../../../../client/js/components/connection/connection-service');

chai.should();

describe('The Connection Service', function () {
	it('Should exist!', function () {
		ConnectionService.should.exist;
	});

	it('Should implement the "ERROR" trigger', function () {
		ConnectionService.ERROR.should.be.a('string').not.empty;
	});

	it('Should implement the "BUSY" trigger', function () {
		ConnectionService.BUSY.should.be.a('string').not.empty;
	});

	it('Should implement the "READY" trigger', function () {
		ConnectionService.READY.should.be.a('string').not.empty;
	});

	it('Should implement the "CONNECTED" trigger', function () {
		ConnectionService.CONNECTED.should.be.a('string').not.empty;
	});

	it('Should implement the "ALREADY_CONNECTED" trigger', function () {
		ConnectionService.ALREADY_CONNECTED.should.be.a('string').not.empty;
	});

	it('Should implement the "DISCONNECTED" trigger', function () {
		ConnectionService.DISCONNECTED.should.be.a('string').not.empty;
	});

	it('Should implement the "NOT_CONNECTED" trigger', function () {
		ConnectionService.NOT_CONNECTED.should.be.a('string').not.empty;
	});

	describe('As an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new ConnectionService();
		});

		afterEach(function () {
			instance = null;
		});

		it('Should implement the "connect" method', function () {
			instance.should.respondTo('connect');
		});

		it('Should trigger an ERROR event when connection fails', function (done) {
			var bogusError = 'bogus error';

			instance.on(ConnectionService.ERROR, function (error) {
				error.should.equal(bogusError);
				done();
			});
			instance.connect();
			nodeXMPPClient.getInstance().emit('error', bogusError);
		});

		it('Should trigger a CONNECTED event after connecting', function (done) {
			instance.on(ConnectionService.CONNECTED, done);
			instance.connect();
			nodeXMPPClient.getInstance().emit('online');
		});

		it('Should resolve a connection attempt even when busy', function (done) {
			instance.on(ConnectionService.ALREADY_CONNECTED, done);
			instance.connect();
			instance.connect();
			nodeXMPPClient.getInstance().emit('online');
		});

		it('Should trigger an ALREADY_CONNECTED event when trying to connect and already connected', function (done) {
			instance.on(ConnectionService.ALREADY_CONNECTED, done);
			instance.on(ConnectionService.CONNECTED, function() {
				instance.connect();
			});
			instance.connect();
			nodeXMPPClient.getInstance().emit('online');
		});

		it('Should implement the "disconnect" method', function () {
			instance.should.respondTo('disconnect');
		});

		it('Should trigger a NOT_CONNECTED event trying to disconnect and not yet connected', function (done) {
			instance.on(ConnectionService.NOT_CONNECTED, done);
			instance.disconnect();
		});

		it('Should trigger a DISCONNECTED after disconnecting', function (done) {
			instance.on(ConnectionService.DISCONNECTED, done);
			instance.on(ConnectionService.CONNECTED, function() {
				instance.disconnect();
			});
			instance.connect();
			nodeXMPPClient.getInstance().emit('online');
		});

		it('Should resolve a disconnect attempt even when busy', function (done) {
			instance.on(ConnectionService.DISCONNECTED, done);
			instance.connect();
			instance.disconnect();
			nodeXMPPClient.getInstance().emit('online');
		});

		it('Should trigger the BUSY event when connecting', function (done) {
			instance.on(ConnectionService.BUSY, done);
			instance.connect();
		});

		it('Should trigger the READY event after connecting', function (done) {
			instance.on(ConnectionService.READY, done);
			instance.connect();
			nodeXMPPClient.getInstance().emit('online');
		});

		it('Should trigger the BUSY event when disconnecting', function (done) {
			instance.on(ConnectionService.READY, function () {
				instance.on(ConnectionService.BUSY, done);
				instance.disconnect();
			});
			instance.connect();
			nodeXMPPClient.getInstance().emit('online');
		});

		it('Should trigger the READY event after disconnecting', function (done) {
			instance.on(ConnectionService.READY, function () {
				instance.on(ConnectionService.READY, done);
				instance.disconnect();
			});
			instance.connect();
			nodeXMPPClient.getInstance().emit('online');
		});
	});
});
