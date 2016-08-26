var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Constructor = function () {
	this.jid = '';
	this.connection = {};
	this.connection.socket = {};
	this.connection.socket.socket = {};
	this.connection.socket.socket.upgradeReq = {};
	this.connection.socket.socket.upgradeReq.connection = {};
};
util.inherits(Constructor, EventEmitter);

module.exports = Constructor;
