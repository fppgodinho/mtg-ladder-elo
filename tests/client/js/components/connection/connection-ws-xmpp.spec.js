var chai = require('chai');
var expect = require('chai').expect;
var jsdom = require('mocha-jsdom');
var sinon = require('sinon');
var nodeXMPPClient = require('./../../../../../mockups/client/node-xmpp-client');
var ConnectionWSXMPP = require('./../../../../../client/js/components/connection/connection-ws-xmpp');


chai.should();

describe('The Connection WS XMPP class', function () {
	jsdom();

	it ('Should exist', function () {
		ConnectionWSXMPP.should.exist;
	});

	it ('Should be a function', function () {
		ConnectionWSXMPP.should.be.a('function');
	});

	describe('As an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new ConnectionWSXMPP();
		});

		afterEach(function () {
			instance = null;
		});

		it ('Should implement the "setup" method', function () {
			instance.should.respondTo('setup');
		});

		it ('Should implement the "connect" method', function () {
			instance.should.respondTo('connect');
		});

		it ('Should invoke the callback after calling "connect"', function (done) {
			instance.connect(done);
			nodeXMPPClient.emit('online');
		});

		it ('Should invoke the callback after calling "disconnect"', function (done) {
			instance.disconnect(function() {
				done();
			});
		});

		it ('Should invoke the callback after calling "request"', function (done) {
			instance.request({}, done);
		});

		it ('Should implement the "disconnect" method', function () {
			instance.should.respondTo('disconnect');
		});

		it ('Should implement the "request" method', function () {
			instance.should.respondTo('request');
		});

		it ('Should resolve a valid connection call without errors', function (done) {
			instance.connect(function (err) {
				expect(err).not.to.exist;
				done();
			});
			nodeXMPPClient.emit('online');
		});

		it ('Should resolve an invalid connection call with an error', function (done) {
			var errorMsg = 'Mocked Error';

			instance.connect(function (err) {
				expect(err).to.equal(errorMsg);
				done();
			});
			nodeXMPPClient.emit('error', errorMsg);
		});

		it ('Should resolve a valid disconnect call without errors', function (done) {
			instance.connect(function() {
				instance.disconnect(function (err) {
					expect(err).not.to.exist;
					done();
				})
			});
			nodeXMPPClient.emit('online');
		});

		it ('Should resolve an invalid disconnect call with an error', function (done) {
			instance.disconnect(function (err) {
				expect(err).to.equal(ConnectionWSXMPP.NOT_CONNECTED);
				done();
			})
		});
	});
});
