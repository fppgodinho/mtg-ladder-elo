var EventEmitter = require('events');
var chai = require('chai');
var Main = require('../../src/server/main');

chai.should();

describe('The Main class', function () {

	it('should exist!', function () {
		Main.should.exist;
	});

});
