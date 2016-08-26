var ConnectionEvent = require('./../../../../../src/client/js/services/connection/connection-event');

describe('The Connection class', function () {
	it ('Should exist', function () {
		ConnectionEvent.should.exist;
	});

	it ('Should be a function', function () {
		ConnectionEvent.should.be.a('function');
	});

	it ('Should have the "CONNECTED" constant set to a non empty string', function (){
		ConnectionEvent.CONNECTED.should.be.a('string').and.not.empty;
	});

	it ('Should have the "DISCONNECTED" constant set to a non empty string', function (){
		ConnectionEvent.DISCONNECTED.should.be.a('string').and.not.empty;
	});

	it ('Should have the "BUSY" constant set to a non empty string', function (){
		ConnectionEvent.BUSY.should.be.a('string').and.not.empty;
	});

	it ('Should have the "READY" constant set to a non empty string', function (){
		ConnectionEvent.READY.should.be.a('string').and.not.empty;
	});

	it ('Should have the "ERROR" constant set to a non empty string', function (){
		ConnectionEvent.ERROR.should.be.a('string').and.not.empty;
	});

	it ('Should have the "ALREADY_CONNECTED" constant set to a non empty string', function (){
		ConnectionEvent.ALREADY_CONNECTED.should.be.a('string').and.not.empty;
	});

	it ('Should have the "NOT_CONNECTED" constant set to a non empty string', function (){
		ConnectionEvent.NOT_CONNECTED.should.be.a('string').and.not.empty;
	});

	it ('Should have the "MESSAGE" constant set to a non empty string', function (){
		ConnectionEvent.MESSAGE.should.be.a('string').and.not.empty;
	});
});