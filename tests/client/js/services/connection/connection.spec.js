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

		it ('Should have the "CONNECTED" constant set to "' + ConnectionEvent.CONNECTED + '"', function (){
			instance.CONNECTED.should.equal(ConnectionEvent.CONNECTED);
		});

		it ('Should have the "DISCONNECTED" constant set to "' + ConnectionEvent.DISCONNECTED + '"', function (){
			instance.DISCONNECTED.should.equal(ConnectionEvent.DISCONNECTED);
		});

		it ('Should have the "BUSY" constant set to "' + ConnectionEvent.BUSY + '"', function (){
			instance.BUSY.should.equal(ConnectionEvent.BUSY);
		});

		it ('Should have the "READY" constant set to "' + ConnectionEvent.READY + '"', function (){
			instance.READY.should.equal(ConnectionEvent.READY);
		});

		it ('Should have the "ERROR" constant set to "' + ConnectionEvent.ERROR + '"', function (){
			instance.ERROR.should.equal(ConnectionEvent.ERROR);
		});

		it ('Should have the "ALREADY_CONNECTED" constant set to "' + ConnectionEvent.ALREADY_CONNECTED + '"', function (){
			instance.ALREADY_CONNECTED.should.equal(ConnectionEvent.ALREADY_CONNECTED);
		});

		it ('Should have the "NOT_CONNECTED" constant set to "' + ConnectionEvent.NOT_CONNECTED + '"', function (){
			instance.NOT_CONNECTED.should.equal(ConnectionEvent.NOT_CONNECTED);
		});

		it ('Should have the "MESSAGE" constant set to "' + ConnectionEvent.MESSAGE + '"', function (){
			instance.MESSAGE.should.equal(ConnectionEvent.MESSAGE);
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