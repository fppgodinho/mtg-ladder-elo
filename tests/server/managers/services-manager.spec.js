var EventEmitter = require('events');
var ServicesManager = require('../../../src/server/managers/services-manager');

describe('The Models Manager class', function () {
	var service = {};
	var serviceName = 'bogus';

	it('should exist!', function () {
		ServicesManager.should.exist;
	});

	it('Should implement the "ADDED" trigger', function () {
		ServicesManager.ADDED.should.be.a('string').not.empty;
	});

	it('Should implement the "ERROR" trigger', function () {
		ServicesManager.ERROR.should.be.a('string').not.empty;
	});

	it('Should be a singleton', function () {
		ServicesManager.should.be.an.instanceOf(EventEmitter);
	});

	it('Should implement the set method', function () {
		ServicesManager.should.respondTo('set');
	});

	it('Should trigger an ADDED event after the set method with the name of the service', function (done) {
		ServicesManager.once(ServicesManager.ADDED, function (name) {
			name.should.equal(serviceName);
			done();
		});
		ServicesManager.set(serviceName, service);
	});

	it('Should trigger an ERROR event ', function (done) {
		var serviceName = 'bogus';

		ServicesManager.once(ServicesManager.ERROR, function () {
			done();
		});
		ServicesManager.set(serviceName, service);
	});

	it('Should implement the get method', function () {
		ServicesManager.should.respondTo('get');
	});

	it('Should return it when requested by it\'s name', function () {
		ServicesManager.get(serviceName).should.equal(service);
	});
});
