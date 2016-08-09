var chai = require('chai');
var Authentication = require('../../../src/server/services/authentication-service');

chai.should();

describe('The Authentication Service class', function () {

	it('should exist!', function () {
		Authentication.should.exist;
	});

});
