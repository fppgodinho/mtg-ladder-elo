var ConnectionEvent = require('./../../../../../src/client/js/services/connection/connection-event');

describe('The Connection Event class', function () {
	it ('Should exist', function () {
		ConnectionEvent.should.exist;
	});

	it ('Should be a function', function () {
		ConnectionEvent.should.be.a('function');
	});

	it ('Should have the "STATE_CHANGED" constant set to a non empty string', function (){
		ConnectionEvent.STATE_CHANGED.should.be.a('string').and.not.empty;
	});

	it ('Should have the "ERROR" constant set to a non empty string', function (){
		ConnectionEvent.ERROR.should.be.a('string').and.not.empty;
	});

	it ('Should have the "MESSAGE" constant set to a non empty string', function (){
		ConnectionEvent.MESSAGE.should.be.a('string').and.not.empty;
	});
});