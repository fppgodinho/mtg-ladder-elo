var chai = require('chai');
var expect = require('chai').expect;
var jsdom = require('mocha-jsdom');
var sinon = require('sinon');
var nodeXMPPClient = require('./../../../../../mockups/client/node-xmpp-client');
var ConnectionBase = require('./../../../../../client/js/components/connection/connection-base');
var ConnectionXMPP = require('./../../../../../client/js/components/connection/connection-xmpp');

chai.should();

describe('The ConnectionXMPP class', function () {
	jsdom();

	it ('Should exist', function () {
		ConnectionXMPP.should.exist;
	});

	it ('Should be a "function"', function () {
		ConnectionXMPP.should.be.a('function');
	});

	it ('Should have the "WEBSOCKET" constant set to a non empty string ', function (){
		ConnectionXMPP.WEBSOCKET.should.be.a('string').and.not.empty;
	});

	it ('Should have the "UNKNOWN_CONNECTION_TYPE" constant set to a non empty string ', function (){
		ConnectionXMPP.UNKNOWN_CONNECTION_TYPE.should.be.a('string').and.not.empty;
	});

	describe('As an instance', function () {
		var connectionType = ConnectionXMPP.WEBSOCKET;
		var protocol = 'http';
		var address = 'bogus.com';
		var port = '666';
		var instance;

		beforeEach(function () {
			instance = new ConnectionXMPP();
			instance.setup(connectionType, protocol, address, port);
		});

		afterEach(function () {
			instance = null;
		});

		it ('Should inherit the "ConnectionBase" class', function () {
			instance.should.be.an.instanceof(ConnectionBase, 'instance is not a ConnectionBase');
		});

		it ('Should invoke the callback after calling "connect"', function (done) {
			instance.connect(done);
			nodeXMPPClient.emit('online');
		});

		it ('Should resolve with an error when connection with an unknown connection type', function (done) {
			instance.setup('BogusConnectionType', protocol, address, port);
			instance.connect(function (err) {
				err.should.equal(ConnectionXMPP.UNKNOWN_CONNECTION_TYPE);
				done();
			});
		});

		it ('Should setup the xmpp connection type with the correct WebSocket url', function (done) {
			var expectedURL = protocol + '://' + address + ':' + port;

			instance.connect(function() {
				nodeXMPPClient.options.websocket.url.should.equal(expectedURL);
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

		it ('Should invoke the callback after calling "disconnect"', function (done) {
			instance.disconnect(function() {
				done();
			});
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
				expect(err).to.equal(ConnectionBase.NOT_CONNECTED);
				done();
			})
		});

		it ('Should invoke the callback after calling "request"', function (done) {
			instance.request({}, done);
		});
	});
});
