var Waterline = require('./../../../mockups/server/waterline');

var Abstract = require('./../../../src/server/models/abstract-model');

describe('The Users Model Class', function () {
	var Users;

	beforeEach(function () {
		Waterline.mockStart();
		Users = require('./../../../src/server/models/users-model');
	});

	afterEach(function () {
		Waterline.mockStop();
	});

	it('Should exist', function () {
		Users.should.exist;
	});

	describe('As an instance', function () {
		var instance;
		var waterline;

		beforeEach(function () {
			waterline = new Waterline();

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
