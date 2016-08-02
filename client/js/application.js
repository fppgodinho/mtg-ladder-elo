var servicesManager = require('./managers/servicesManager');
var ConnectionService = require('./components/connection/connection-service');

var Constructor = function (context, interval) {
  	this._context = context;
	this._interval = interval;

	this._mapServices();
	this._checkLoaded();
};

Constructor.prototype._mapServices = function () {
	var connection = new ConnectionService();

	servicesManager.set('connection', connection);

	connection.connect();
};

Constructor.prototype._checkLoaded = function () {
	if (this._context.readyState === 'complete') {
		this.init();
	} else {
		setTimeout(this._checkLoaded.bind(this), this._interval);
	}
};

Constructor.prototype.init = function () {
	var element = window.document.createElement('div');
	element.innerHTML = 'Hello World!!';

	var body = window.document.querySelector('body');
	body.appendChild(element);
};

module.exports = Constructor;
