var sinon = require('sinon');
var Application = require('./../../../src/client/js/application');

describe('The Application class', function () {

	it('should exist!', function () {
		Application.should.exist;
	});

	describe('As an instance', function () {
		var interval = 10;
		var clock, context, instance, sandbox;

		beforeEach(function () {
			sandbox = sinon.sandbox.create();
			clock = sandbox.useFakeTimers();
			context = {
				readyState: 'loading'
			};
			instance = new Application(context, interval);
		});

		afterEach(function () {
			sandbox.restore();
		});

		it ('Should never be initialized if context is not ready', function () {
			var spy = sandbox.spy(instance, 'init');

			spy.neverCalledWith().should.be.true;
		});
		//
		it ('Should be initialized if context is ready', function () {
			var spy = sandbox.spy(instance, 'init');

			context.readyState = 'complete';
			clock.tick(1000);
			spy.calledOnce.should.be.true;
		});
	});
});
