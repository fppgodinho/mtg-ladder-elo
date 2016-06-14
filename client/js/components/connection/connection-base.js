var Constructor = function () {};

Constructor.prototype.setup = function () {};

Constructor.prototype.connect = function (callback) {
	callback();
};

Constructor.prototype.disconnect = function (callback) {
	callback();
};

Constructor.prototype.request = function (data, callback) {
	callback();
};

module.exports = Constructor;