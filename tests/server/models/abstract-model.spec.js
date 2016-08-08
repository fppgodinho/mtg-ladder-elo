var chai = require('chai');
var Waterline = require('./../../../mockups/server/waterline');
var Abstract = require('./../../../src/server/models/abstract-model');

chai.should();

describe('The XMPP Class', function () {
	it('Should exist', function () {
		Abstract.should.exist;
	});

	describe('As an instance', function () {
		var instance;
		var waterline;

		beforeEach(function () {
			waterline = Waterline.getInstance();
			instance = new Abstract(waterline);
		});

		afterEach(function () {
			instance = null;
		});

		it('Should implement the "find" method', function () {
			instance.should.respondTo('find');
		});

		it('Should implement the "findOne" method', function () {
			instance.should.respondTo('findOne');
		});

		it('Should implement the "create" method', function () {
			instance.should.respondTo('create');
		});

		it('Should implement the "findOrCreate" method', function () {
			instance.should.respondTo('findOrCreate');
		});

		it('Should implement the "update" method', function () {
			instance.should.respondTo('update');
		});

		it('Should implement the "destroy" method', function () {
			instance.should.respondTo('destroy');
		});

		it('Should implement the "query" method', function () {
			instance.should.respondTo('query');
		});
	});
});
