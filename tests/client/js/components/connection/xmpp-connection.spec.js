var chai = require('chai');
var expect = require('chai').expect;
var jsdom = require('mocha-jsdom');
var sinon = require('sinon');
var nodeXMPPClient = require('./../../../../../mockups/client/node-xmpp-client');
var ConnectionBase = require('./../../../../../src/client/js/components/connection/connection');
var ConnectionXMPP = require('./../../../../../src/client/js/components/connection/xmpp-connection');

chai.should();

describe('The XMPP Connection class', function () {
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

		it ('Should trigger the "CONNECTED" event on a successful connection', function (done) {
			instance.on(ConnectionBase.CONNECTED, done);
			instance.connect();
			nodeXMPPClient.getInstance().emit('online');
		});

		it ('Should resolve with an error when connection with an unknown connection type', function (done) {
			instance.setup('BogusConnectionType', protocol, address, port);
			instance.on(ConnectionBase.ERROR, function (error) {
				error.should.equal(ConnectionXMPP.UNKNOWN_CONNECTION_TYPE);
				done();
			});
			instance.connect();
		});

		it ('Should setup the xmpp connection type with the correct WebSocket url', function (done) {
			var expectedURL = protocol + '://' + address + ':' + port;
			instance.on(ConnectionBase.CONNECTED, function () {
				nodeXMPPClient.getInstance().options.websocket.url.should.equal(expectedURL);
				done();
			});
			instance.connect();
			nodeXMPPClient.getInstance().emit('online');
		});

		it ('Should resolve an invalid connection call with an error', function (done) {
			var errorMsg = 'Mocked Error';
			instance.on(ConnectionBase.ERROR, function (error) {
				error.should.equal(errorMsg);
				done();
			});
			instance.connect();
			nodeXMPPClient.getInstance().emit('error', errorMsg);
		});

		it ('Should resolve a valid disconnect call without errors', function (done) {
			instance.on(ConnectionBase.DISCONNECTED, done);
			instance.on(ConnectionBase.CONNECTED, function () {
				instance.disconnect();
			});
			instance.connect();
			nodeXMPPClient.getInstance().emit('online');
		});

		it ('Should resolve an invalid disconnect call with an error', function (done) {
			instance.on(ConnectionBase.ERROR, function (error) {
				expect(error).to.equal(ConnectionBase.NOT_CONNECTED);
				done();
			});
			instance.disconnect();
		});
	});
});
