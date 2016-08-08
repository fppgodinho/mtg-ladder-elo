var EventEmitter = require('events').EventEmitter;
var chai = require('chai');
var nodeXMPPServer = require('./../../../mockups/server/node-xmpp-server');
var Waterline = require('./../../../mockups/server/waterline');
var xmpp = require('./../../../src/server/controllers/xmpp-controller');

chai.should();

describe('The XMPP Class', function () {
	it('Should exist', function () {
		xmpp.should.exist;
	});

	describe('As an instance', function () {
		var instance;

		beforeEach(function (done) {
			instance = new xmpp(null, null, done);
		});

		afterEach(function (done) {
			instance.disconnect();
			instance = null;
			Waterline.destroy(done);
		});

		it('Should have the "connected" method', function () {
			instance.should.respondTo('connect');
		});

		it('Should fail silently when connecting a connected instance', function () {
			instance.connect();
			instance.connect().should.be.false;
		});

		it('Should connect', function () {
			instance.connect().should.be.true;
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
			client.connection = {};
			client.connection.socket = {};
			client.connection.socket.socket = {};
			client.connection.socket.socket.upgradeReq = {};
			client.connection.socket.socket.upgradeReq.connection = {};

			nodeXMPPServer.getInstance().emit('connection', client);
			client.emit('register', {}, function () {
				done();
			});
		});
	});
});
