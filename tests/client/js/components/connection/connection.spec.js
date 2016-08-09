var EventEmiter = require('events');
var chai = require('chai');
var Class = require('../../../../../src/client/js/components/connection/connection');

chai.should();

describe('The Connection class', function () {
	it ('Should exist', function () {
		Class.should.exist;
	});

	it ('Should be a function', function () {
		Class.should.be.a('function');
	});

	it ('Should have the "BUSY" constant set to a non empty string ', function (){
		Class.BUSY.should.be.a('string').and.not.empty;
	});

	it ('Should have the "CONNECTED" constant set to a non empty string ', function (){
		Class.CONNECTED.should.be.a('string').and.not.empty;
	});

	it ('Should have the "DISCONNECTED" constant set to a non empty string ', function (){
		Class.DISCONNECTED.should.be.a('string').and.not.empty;
	});

	it ('Should have the "ERROR" constant set to a non empty string ', function (){
		Class.ERROR.should.be.a('string').and.not.empty;
	});

	it ('Should have the "ALREADY_CONNECTED" constant set to a non empty string ', function (){
		Class.ALREADY_CONNECTED.should.be.a('string').and.not.empty;
	});

	it ('Should have the "NOT_CONNECTED" constant set to a non empty string ', function (){
		Class.NOT_CONNECTED.should.be.a('string').and.not.empty;
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

		it ('Should invoke the callback after calling "connect"', function (done) {
			instance.connect(done);
		});

		it ('Should implement the "disconnect" method', function () {
			instance.should.respondTo('disconnect');
		});

		it ('Should invoke the callback after calling "disconnect"', function (done) {
			instance.disconnect(done);
		});

		it ('Should implement the "request" method', function () {
			instance.should.respondTo('request');
		});

		it ('Should invoke the callback after calling "request"', function (done) {
			instance.request({}, done);
		});
	});
});