var EventEmitter = require('events');
var TemplatesManager = require('../../../../src/client/js/managers/templates-manager');

describe('The Services Manager class', function () {
	var service = {};
	var serviceName = 'bogus';

	it('should exist!', function () {
		TemplatesManager.should.exist;
	});

	it('Should implement the "ADDED" trigger', function () {
		TemplatesManager.ADDED.should.be.a('string').not.empty;
	});

	it('Should implement the "ERROR" trigger', function () {
		TemplatesManager.ERROR.should.be.a('string').not.empty;
	});

	it('Should be a singleton', function () {
		TemplatesManager.should.be.an.instanceOf(EventEmitter);
	});

	it('Should implement the set method', function () {
		TemplatesManager.should.respondTo('set');
	});

	it('Should trigger an ADDED event after the set method with the name of the service', function (done) {
		TemplatesManager.once(TemplatesManager.ADDED, function (name) {
			name.should.equal(serviceName);
			done();
		});
		TemplatesManager.set(serviceName, service);
	});

	it('Should trigger an ERROR event ', function (done) {
		var serviceName = 'bogus';

		TemplatesManager.once(TemplatesManager.ERROR, function () {
			done();
		});
		TemplatesManager.set(serviceName, service);
	});

	it('Should implement the get method', function () {
		TemplatesManager.should.respondTo('get');
	});

	it('Should return it when requested by it\'s name', function () {
		TemplatesManager.get(serviceName).should.equal(service);
	});
});
