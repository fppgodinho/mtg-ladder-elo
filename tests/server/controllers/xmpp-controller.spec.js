var sinon = require('sinon');

var nodeXMPPServer = require('./../../../mockups/server/node-xmpp-server');
var servicesManager = require('./../../../mockups/server/managers/services-manager');
var componentsManager = require('./../../../mockups/server/managers/components-manager');
var botsManager = require('./../../../mockups/server/managers/bots-manager');
var ProfileManagerBot = require('./../../../mockups/server/bots/profile-manager');
var XMPPMessengerComponent = require('./../../../mockups/server/components/xmpp/messenger');
var AuthenticationService = require('./../../../mockups/server/services/authentication-service');
var Socket = require('./../../../mockups/server/socket');

describe('The XMPP Controller Class', function () {
	var xmpp, sandbox, authenticationService;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		ProfileManagerBot.mockStart();
		XMPPMessengerComponent.mockStart();
		AuthenticationService.mockStart();

		botsManager.mockStart();
		componentsManager.mockStart();
		servicesManager.mockStart();

		xmpp = require('./../../../src/server/controllers/xmpp-controller');
		authenticationService = servicesManager.set('authentication', new AuthenticationService());
	});

	afterEach(function () {
		botsManager.clear();
		componentsManager.clear();
		servicesManager.clear();

		botsManager.mockStop();
		componentsManager.mockStop();
		servicesManager.mockStop();

		AuthenticationService.mockStop();
		XMPPMessengerComponent.mockStop();
		ProfileManagerBot.mockStop();

		sandbox.restore();
	});

	it('Should exist', function () {
		xmpp.should.exist;
	});

	describe('As an instance', function () {
		var instance;

		beforeEach(function () {
			sandbox = sinon.sandbox.create();
			ProfileManagerBot.mockStart();
			var xmpp = require('./../../../src/server/controllers/xmpp-controller');
			instance = new xmpp(null, null);
		});

		afterEach(function () {
			instance.disconnect();
			instance = null;
			ProfileManagerBot.mockStop();
			botsManager.clear();
			sandbox.restore();
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
