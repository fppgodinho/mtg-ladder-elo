var sinon = require('sinon');
var should = require('chai').should();
var Application = require('../../../client/js/application');

describe('The Application class', function () {
	it('should exist!', function () {
		Application.should.exist;
	});

	describe('As an instance', function () {
		var sandbox;
		var context;
		var interval = 10;
		var instance;

		beforeEach(function () {
			sandbox = sinon.sandbox.create();
			context = {
				readyState: 'loading'
			};
			instance = new Application(context, interval);
		});

		afterEach(function () {
			sandbox.restore();
		});

		it ('Should never be initialized if context is not ready', function (done) {
			var spy = sandbox.spy(instance, 'init');
			setTimeout(function () {
				spy.neverCalledWith().should.be.true;
				done();
			}, interval);
		});

		it ('Should be initialized if context is ready', function (done) {
			context.readyState = 'complete';
			var spy = sandbox.spy(instance, 'init');
			setTimeout(function () {
				spy.calledOnce.should.be.true;
				done();
			}, interval);
		});
	});

});
