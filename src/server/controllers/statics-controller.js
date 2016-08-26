var express = require('express');

var Routes = require('./../components/statics/routes');

var Constructor = function (path, port) {
	this._connected = false;
	this._port = port || 3001;
	this._server = express();
	this._routes = new Routes(path + 'lib/', path + 'index.html');
};

Constructor.prototype.connect = function () {
	var result = false;

	if (!this._connected) {
		this._server.use(this._routes.logger.bind(this._routes));
		this._server.use('*/lib/*', this._routes.staticAssets.bind(this._routes));
		this._server.use(this._routes.staticIndex.bind(this._routes));

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
