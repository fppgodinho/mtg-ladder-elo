var sinon = require('sinon');

var modelsManager = require('./../../../mockups/server/managers/models-manager');
var UsersModel = require('./../../../mockups/server/models/users-model');
var NodeXMPPClient = require('./../../../mockups/server/node-xmpp-client');

var credentials = require('./../../../src/server/bots/credentials/profile-user');

describe('The Profile Manager Bot Class', function () {
	var ProfileManagerBot, sandbox, users;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		modelsManager.mockStart();
		UsersModel.mockStart();
		NodeXMPPClient.mockStart();

		users = modelsManager.set('users', new UsersModel());
		ProfileManagerBot = require('./../../../src/server/bots/profile-manager');
	});

	afterEach(function () {
		modelsManager.clear();

		NodeXMPPClient.mockStop();
		UsersModel.mockStop();
		modelsManager.mockStop();

		sandbox.restore();
	});

	it('Should exist', function () {
		ProfileManagerBot.should.exist;
	});

	describe('As an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new ProfileManagerBot(null, null);
		});

		afterEach(function () {
			instance = null;
		});

		it('Should have the "connected" method', function () {
			instance.should.respondTo('connect');
		});
		
		it('Should check credentials object when connecting', function () {
			var spy = sandbox.spy(users, 'findOrCreate');

			instance.connect();

			spy.should.have.been.calledWith({user: credentials.user}, credentials);
		});

		describe('After connecting', function () {
			var connection;

			beforeEach(function (done) {
				setTimeout(function () {
					connection = NodeXMPPClient.getInstance();
					done();
				});
				instance.connect();
			});

			it('Should become online when the connection triggers an "ONLINE" event', function () {
				connection.emit('online');
				instance.isOnline().should.be.true;
			});

			it('Should fail silently on missing stanza', function () {
				connection.emit('stanza');
			});

			it('Should send an error iq stanza on nonexistent user', function (done) {
				var client = NodeXMPPClient.getInstance();
				client.send = function (stanza) {
					try {
						stanza.attrs.type.should.equal('error');
						done();
					} catch (error) {
						done(error);
					}
				};

				users.setResult(null, null);
				stanza = {attrs:{from: 'test@test/test'}};
				connection.emit('stanza', stanza);
			});

			it('Should send an error iq stanza on model error', function (done) {
				var client = NodeXMPPClient.getInstance();
				client.send = function (stanza) {
					try {
						stanza.attrs.type.should.equal('error');
						done();
					} catch (error) {
						done(error);
					}
				};

				users.setResult('error', {});
				stanza = {attrs:{from: 'test@test/test'}};
				connection.emit('stanza', stanza);
			});

			it('Should send an result iq stanza on valid requests', function (done) {
				var client = NodeXMPPClient.getInstance();
				client.send = function (stanza) {
					try {
						stanza.attrs.type.should.equal('result');
						done();
					} catch (error) {
						done(error);
					}
				};

				users.setResult(null, {});
				stanza = {attrs:{from: 'test@test/test'}};
				connection.emit('stanza', stanza);
			});
		});
	});
});
