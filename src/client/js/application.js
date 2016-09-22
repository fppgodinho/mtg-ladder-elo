var servicesManager = require('./managers/services-manager');
var templatesManager = require('./managers/templates-manager');

var SessionService = require('./services/session/session-service');
var XMPPService = require('./services/connection/xmpp-service');

var MainController = require('./components/base/main-controller');

var Constructor = function (context, interval) {
	this._mapServices();
	this._mapTemplates();

  	this._parent = context;
	this._interval = interval;
	this._mainController = null;

	this._checkLoaded();
};

Constructor.prototype._mapServices = function () {
	servicesManager.set('session', new SessionService());
	servicesManager.set('xmpp', new XMPPService());
};

Constructor.prototype._mapTemplates = function () {
	templatesManager.set('main', require('./components/base/main-template.html'));
	templatesManager.set('menu', require('./components/menu/menu-template.html'));
	templatesManager.set('login', require('./components/auth/login-template.html'));
	templatesManager.set('logout', require('./components/auth/logout-template.html'));
};

Constructor.prototype._checkLoaded = function () {
	if (this._parent.readyState === 'complete') {
		this.init();
	} else {
		setTimeout(this._checkLoaded.bind(this), this._interval);
	}
};

Constructor.prototype.init = function () {
	var content = window.document.querySelector('#CONTENT');
	content.innerHTML = '';
	this._mainController = new MainController(content);
};

module.exports = Constructor;
