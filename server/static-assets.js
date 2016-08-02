var express = require('express');

var Constructor = function (path, port) {
	this._connected = false;
	this._port = port || 3001;
	this._server = express();
	this._addLogging();
	this._addStaticAssets(path);
};

Constructor.prototype._addLogging = function () {
	this._server.use(function (req, res, next) {
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		var path = req.protocol + '://' + req.get('host') + req.originalUrl;
		console.log('STATIC ASSET SERVED:', ip, path);
		next();
	});
};

Constructor.prototype._addStaticAssets = function (path) {
	this._server.use(express.static(path));
};

Constructor.prototype.connect = function () {
	var result = false;

	if (!this._connected) {
		this._server.listen(this._port, function () {
			console.log('-------- SERVING STATICS --------');
		});

		this._connected = true;
		result = true;
	}

	return 	result;
};

Constructor.prototype.disconnect = function () {
	var result = false;

	if (this._connected) {
		this._server.close();
		this._connected = false;
		result = true;
	}

	return result;
};

module.exports = Constructor;
