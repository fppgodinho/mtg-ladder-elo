var sinon = require('sinon');
var should = require('chai').should();

var modelsManager = require('./../../../mockups/server/managers/models-manager');
var UsersModel = require('./../../../mockups/server/models/users-model');

describe('The Authentication Service class', function () {
	var sandbox, AuthenticationService;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		modelsManager.mockStart();
		UsersModel.mockStart();
		AuthenticationService = require('../../../src/server/services/authentication-service');
	});

	afterEach(function () {
		UsersModel.mockStop();
		modelsManager.clear();
		modelsManager.mockStop();
		sandbox.restore();
	});

	it('should exist!', function () {
		AuthenticationService.should.exist;
	});

	describe('As an instance', function () {
		var instance, users;

		beforeEach(function () {
			users = modelsManager.set('users', new UsersModel());
			instance = new AuthenticationService();
		});

		afterEach(function () {
		});

		it('Should get the "users" model from the modelsManager when created', function () {
			var spy = sandbox.spy(modelsManager, 'get');

			new AuthenticationService();

			spy.should.have.been.calledWith('users');
		});

		it('Should resolve without errors on a successful validation', function (done) {
			users.setResult(null, {password: 'password'});

			instance.validate('username', 'password', function (error) {
				should.not.exist(error);
				done();
			});
		});

		it('Should resolve without an error on a unsuccessful validation', function (done) {
			users.setResult(null, {password: 'something else'});

			instance.validate('username', 'password', function (error) {
				error.should.equal(AuthenticationService.ERROR);
				done();
			});
		});
	});
});
