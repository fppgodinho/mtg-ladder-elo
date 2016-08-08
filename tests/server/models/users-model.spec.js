var chai = require('chai');
var Waterline = require('./../../../mockups/server/waterline');
var Abstract = require('./../../../src/server/models/abstract-model');
var Users = require('./../../../src/server/models/users-model');

chai.should();

describe('The Users Model Class', function () {
	it('Should exist', function () {
		Users.should.exist;
	});

	describe('As an instance', function () {
		var instance;
		var waterline;

		beforeEach(function () {
			waterline = Waterline.getInstance();
			instance = new Users(waterline);
		});

		afterEach(function () {
			instance = null;
		});

		it ('Should inherit the "Abstract" class', function () {
			instance.should.be.an.instanceof(Abstract, 'instance is not a Abstract');
		});
	});
});
