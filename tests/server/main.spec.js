var servicesManager = require('./../../mockups/server/managers/services-manager');
var componentsManager = require('./../../mockups/server/managers/components-manager');
var botsManager = require('./../../mockups/server/managers/bots-manager');

var AuthenticationService = require('./../../mockups/server/services/authentication-service');
var UsersModel = require('./../../mockups/server/models/users-model');

describe('The Main class', function () {
	var Main;
	var config = {
		statics: {
			path: '',
			port: ''
		},
		xmpp: {
			host: '',
			port: ''
		}
	};

	beforeEach(function () {
		AuthenticationService.mockStart();
		UsersModel.mockStart();

		botsManager.mockStart();
		componentsManager.mockStart();
		servicesManager.mockStart();

		Main = require('../../src/server/main');
	});

	afterEach(function () {
		botsManager.clear();
		componentsManager.clear();
		servicesManager.clear();

		botsManager.mockStop();
		componentsManager.mockStop();
		servicesManager.mockStop();

		UsersModel.mockStop();
		AuthenticationService.mockStop();
	});

	it('should exist!', function () {
		Main.should.exist;
	});

	it('Resolve silently on creation', function () {
		var instance = new Main(config);
		instance.should.exist;
	});
});
