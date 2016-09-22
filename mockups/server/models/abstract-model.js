var mock = require('mock-require');
var when = require('when');

var _instance = null;

var Constructor = function () {
	_instance = this;
	this._error = null;
	this._result = null;
};

Constructor.prototype.setResult = function (error, result) {
	this._error = error;
	this._result = result;
};

Constructor.prototype.find = function () {
	return this._createPromise();
};

Constructor.prototype.findOne = function () {
	return this._createPromise();
};

Constructor.prototype.create = function () {
	return this._createPromise();
};

Constructor.prototype.findOrCreate = function () {
	return this._createPromise();
};

Constructor.prototype.update = function () {
	return this._createPromise();
};

Constructor.prototype.destroy = function () {
	return this._createPromise();
};

Constructor.prototype.query = function () {
	return this._createPromise();
};

Constructor.prototype._createPromise = function () {
	var promise;

	if (this._error) {
		promise = when.reject(this._error);
	}  else {
		promise = when.resolve(this._result);
	}

	return promise;
};

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('./../../../src/server/models/abstract-model', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../src/server/models/abstract-model');
};

module.exports = Constructor;
