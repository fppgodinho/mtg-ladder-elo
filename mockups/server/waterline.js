var EventEmitter = require('events').EventEmitter;
var util = require('util');
var mock = require('mock-require');
var Waterline = require('waterline');
var memoryAdaptor = require('sails-memory');

var instance;

var MockUpClass = function () {
	this._memoryDB = new Waterline();
};
util.inherits(MockUpClass, EventEmitter);


MockUpClass.prototype.loadCollection = function (collection) {
	return this._memoryDB.loadCollection(collection);
};
MockUpClass.prototype.initialize = function (config, callback) {

	this._config = {
		adapters: {
			'memory': memoryAdaptor
		},

		connections: {
			default: {
				adapter: 'memory'
			}
		}
	};
	return this._memoryDB.initialize(this._config, callback);
};

function mockup () {
	instance = new MockUpClass();
	return instance;
};
mockup.Collection = Waterline.Collection;

mock('waterline', mockup);

module.exports = {
	getInstance: function () {
		return instance;
	},
	destroy: function (callback) {
		if (instance) {
			instance._memoryDB.teardown(function () {});
			// var adapters = instance._config.adapters || {};
			// var promises = [];
			// console.log(adapters)
			// for (var i in adapters) adapters[i].teardown(null, function() {})
			// Object.keys(adapters)
			// 	.forEach(function (adapter) {
			// 		if (adapters[adapter].teardown) {
			// 			//var promise = new Promise(function (resolve) {
			// 				adapters[adapter].teardown(null, function () {});
			// 			//});
			// 			//promises.push(promise);
			// 		}
			// 	});

			//Promise.all(promises).then(callback);
			setTimeout(callback, 10);
		} else callback();
	}
};
