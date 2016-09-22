var servicesManager = require('./../../managers/services-manager');

var SessionEvent = require('./../../services/session/session-event');
var ConnectionEvent = require('./../../services/connection/connection-event');
var AuthEvent = require('./auth-event');
var LoginView = require('./login-view');
var LogoutView = require('./logout-view');

var Constructor = function (context) {
	this._context = context;
	this._data = null;

	this._sessionService = servicesManager.get('session');
	this._sessionService.on(SessionEvent.CHANGED, this._checkSession.bind(this));

	this._xmppService = servicesManager.get('xmpp');

	this._loginView = new LoginView();
	this._loginView.on(AuthEvent.LOGIN, this._handleLogin.bind(this));

	this._logoutView = new LogoutView();
	this._logoutView.on(AuthEvent.LOGOUT, this._handleLogout.bind(this));
};

Constructor.prototype._handleLogin = function (username, password, address, port) {
	var self = this;

	this._xmppService.setup(address, port).then(function() {
		self._xmppService.login(username, password).then(function (data) {
			var user = JSON.parse(data.innerText);

			self._sessionService.setUser(user);
		}).catch(function (error) {
			console.log('Controller::Login failed!', error);
		});
	}).catch(function (error) {
		console.log('->', error);
	});;
};

Constructor.prototype._handleLogout = function () {
	var self = this;

	this._xmppService.logout().then(function () {
		console.log('Controller::Loged out!');
		self._sessionService.setUser();
	}).catch(function (error) {
		console.log('Controller::Logout failed', error);
	});
};

Constructor.prototype._checkSession = function () {
	this._context.innerHTML = '';
	var username = this._sessionService.getUsername();

	if (username) {
		this._logoutView.render(this._context, {username: username});
	} else {
		this._loginView.render(this._context, this._data);
	}
};

Constructor.prototype.update = function (data) {
	this._data = data;
	this._checkSession();
};

module.exports = Constructor;