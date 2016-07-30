var EventEmitter = require('events').EventEmitter;
var chai = require('chai');
var nodeXMPPServer = require('./../../mockups/server/node-xmpp-server');
var Main = require('./../../server/main.js');

chai.should();

describe('The Main Class', function () {
	it('Should exist', function () {
		Main.should.exist;
	});

	describe('As an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new Main();
		});

		afterEach(function () {
			instance.disconnect();
			instance = null;
		});

		it('Should have the "connected" method', function () {
			instance.should.respondTo('connect');
		});

		it('Should connect', function () {
			instance.connect().should.be.true;
		});

		it('Should fail silently when connecting a connected instance', function () {
			instance.connect();
			instance.connect().should.be.false;
		});

		it('Should have the "disconnect" method', function () {
			instance.should.respondTo('disconnect');
		});

		it('Should disconnect', function () {
			instance.connect();
			instance.disconnect().should.be.true;
		});

		it('Should fail silently when disconnecting a disconnected instance', function () {
			instance.connect();
			instance.disconnect();
			instance.disconnect().should.be.false;
		});

		it('Should handle client register requests', function (done) {
			instance.connect();
			var client = new EventEmitter();
			nodeXMPPServer.emit('connection', client);
			client.emit('register', {}, function () {
				done();
			});
		});
	});
});
