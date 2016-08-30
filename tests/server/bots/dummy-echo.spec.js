var sinon = require('sinon');

var modelsManager = require('./../../../mockups/server/managers/models-manager');
var UsersModel = require('./../../../mockups/server/models/users-model');
var NodeXMPPClient = require('./../../../mockups/server/node-xmpp-client');

var credentials = require('./../../../src/server/bots/credentials/dummy-user');

describe('The Dummy Echo Bot Class', function () {
	var ProfileManagerBot, sandbox, users;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		modelsManager.mockStart();
		UsersModel.mockStart();
		NodeXMPPClient.mockStart();

		users = modelsManager.set('users', new UsersModel());
		ProfileManagerBot = require('./../../../src/server/bots/dummy-echo');
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

			it('Should invoke console log on new stanzas', function () {
				var spy = sandbox.spy(console, 'log');
				var message = 'test';

				users.setResult(null, {});
				stanza = {root: function () {
					return message
				}};
				connection.emit('stanza', stanza);

				spy.should.have.been.calledWith('DUMMY ECHO: stanza', message);
			});
		});
	});
});
