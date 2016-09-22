var chai = require('chai');
var sinon = require('sinon');
var express = require('./../../../mockups/server/express');
var StaticAssets = require('./../../../src/server/controllers/statics-controller');

describe('The Statics Controller Class', function () {
	it('Should exist', function () {
		StaticAssets.should.exist;
	});

	describe('As an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new StaticAssets();
		});

		afterEach(function () {
			instance.disconnect();
			instance = null;
		});

		it('Should have the "connected" method', function () {
			instance.should.respondTo('connect');
		});

		it('Should connect', function () {
			instance.connect().should.be.true;
		});

		it('Should fail silently when connecting a connected instance', function () {
			instance.connect();
			instance.connect().should.be.false;
		});

		it('Should have the "disconnect" method', function () {
			instance.should.respondTo('disconnect');
		});

		it('Should disconnect', function () {
			instance.connect();
			instance.disconnect().should.be.true;
		});

		it('Should fail silently when disconnecting a disconnected instance', function () {
			instance.connect();
			instance.disconnect();
			instance.disconnect().should.be.false;
		});

		it('Should invoke the "next" callback when express triggers the default route', function () {
			var test = new StaticAssets();

			test.connect();

			//console.log(express.getInstance()._routes[''].length);
			// express.getInstance().use()
		});
	});
});
