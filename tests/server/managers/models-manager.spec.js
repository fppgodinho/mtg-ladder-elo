var EventEmitter = require('events');
var ModelsManager = require('../../../src/server/managers/models-manager');

describe('The Models Manager class', function () {
	var service = {};
	var serviceName = 'bogus';

	it('should exist!', function () {
		ModelsManager.should.exist;
	});

	it('Should implement the "ADDED" trigger', function () {
		ModelsManager.ADDED.should.be.a('string').not.empty;
	});

	it('Should implement the "ERROR" trigger', function () {
		ModelsManager.ERROR.should.be.a('string').not.empty;
	});

	it('Should be a singleton', function () {
		ModelsManager.should.be.an.instanceOf(EventEmitter);
	});

	it('Should implement the set method', function () {
		ModelsManager.should.respondTo('set');
	});

	it('Should trigger an ADDED event after the set method with the name of the service', function (done) {
		ModelsManager.once(ModelsManager.ADDED, function (name) {
			name.should.equal(serviceName);
			done();
		});
		ModelsManager.set(serviceName, service);
	});

	it('Should trigger an ERROR event ', function (done) {
		var serviceName = 'bogus';

		ModelsManager.once(ModelsManager.ERROR, function () {
			done();
		});
		ModelsManager.set(serviceName, service);
	});

	it('Should implement the get method', function () {
		ModelsManager.should.respondTo('get');
	});

	it('Should return it when requested by it\'s name', function () {
		ModelsManager.get(serviceName).should.equal(service);
	});
});
