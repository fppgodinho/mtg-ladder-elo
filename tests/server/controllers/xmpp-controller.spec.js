var EventEmitter = require('events').EventEmitter;
var chai = require('chai');
var sinon = require('sinon');
var servicesManager = require('./../../../src/server/managers/services-manager');
var componentsManager = require('./../../../src/server/managers/components-manager');

require('./../../../mockups/server/bots/profile-manager');
require('./../../../mockups/server/components/xmpp/messenger');
var nodeXMPPServer = require('./../../../mockups/server/node-xmpp-server');
var AuthenticationService = require('./../../../mockups/server/services/authentication-service');
var Socket = require('./../../../mockups/server/socket');

var xmpp = require('./../../../src/server/controllers/xmpp-controller');

chai.should();
servicesManager.set('authentication', new AuthenticationService());

describe('The XMPP Controller Class', function () {
	it('Should exist', function () {
		xmpp.should.exist;
	});

	describe('As an instance', function () {
		var instance, sandbox, authenticationService;

		beforeEach(function () {
			sandbox = sinon.sandbox.create();
			instance = new xmpp(null, null);
			authenticationService = servicesManager.get('authentication');
		});

		afterEach(function () {
			instance.disconnect();
			instance = null;
			sandbox.restore();
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

		describe('After a client connects', function () {
			var client, messengerComponent;

			beforeEach(function () {
				instance.connect();
				messengerComponent = componentsManager.get('messenger');

				client = new Socket();
				nodeXMPPServer.getInstance().emit('connection', client);
			});
			afterEach(function () {
				client = null;
				instance.disconnect();
			});

			describe('When authenticating', function () {
				it('Should resolve the callback with "false" single argument when the authentication fails', function () {
					var spy = sandbox.spy();

					authenticationService.validate = function (username, password, callback) {
						callback(true);
					};
					client.emit('authenticate', {}, spy);

					spy.should.have.been.calledWithExactly(false);
				});

				it('Should resolve the callback with "null" as first argument and the injected data as second argument when the authentication succeeds', function () {
					var spy = sandbox.spy();
					var data = {};

					authenticationService.validate = function (username, password, callback) {
						callback(false);
					};
					client.emit('authenticate', data, spy);

					spy.should.have.been.calledWithExactly(null, data);
				});
			});

			describe('When registering', function () {
				it('Should resolve the callback with "true" single argument', function () {
					var spy = sandbox.spy();

					client.emit('register', {}, spy);

					spy.should.have.been.calledWithExactly(true);
				});
			});

			describe('When online', function () {
				it('Should not throw break the application', function () {
					client.emit('online');
				});
			});

			describe('When receiving a stanza', function () {
				it('Should not throw break the application', function () {
					var spy = sandbox.spy(messengerComponent, 'notify');
					var data = {};

					client.emit('stanza', data);

					spy.should.have.been.calledWith(data);
				});
			});

			describe('When disconnecting', function () {
				it('Should not throw break the application', function () {
					client.emit('disconnect');
				});
			});
		});
	});
});
