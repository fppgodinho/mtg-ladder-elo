var EventEmiter = require('events');
var Class = require('./../../../../../src/client/js/services/connection/connection');
var ConnectionEvent = require('./../../../../../src/client/js/services/connection/connection-event');

describe('The Connection class', function () {
	it ('Should exist', function () {
		Class.should.exist;
	});

	it ('Should be a function', function () {
		Class.should.be.a('function');
	});

	describe('As an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new Class();
		});

		afterEach(function () {
			instance = null;
		});

		it ('should be an EventEmiter', function () {
			instance.should.be.instanceOf(EventEmiter);
		});

		it ('Should implement the "setup" method', function () {
			instance.should.respondTo('setup');
		});

		it ('Should implement the "connect" method', function () {
			instance.should.respondTo('connect');
		});

		it ('Should implement the "disconnect" method', function () {
			instance.should.respondTo('disconnect');
		});

		it ('Should implement the "send" method', function () {
			instance.should.respondTo('send');
		});
	});
});