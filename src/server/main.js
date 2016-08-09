var Waterline = require('waterline');
var diskAdapter = require('sails-disk');

var modelsManager = require('./managers/models-manager');
var UsersModel = require('./models/users-model');

var servicesManager = require('./managers/services-manager');
var AuthenticationService = require('./services/authentication-service');

var StaticsController = require('./controllers/statics-controller');
var XMPPController = require('./controllers/xmpp-controller');

var Constructor = function (config) {
	this._configDB = null;
	this._waterline = null;

	this._staticsController = null;
	this._xmppController = null;

	this._setup(config);
	this._initialize();
};

Constructor.prototype._setup = function (config) {
	this._configDB = {
		adapters: {
			'disk': diskAdapter
		},

		connections: {
			default: {
				adapter: 'disk',
				filePath: 'data/'
			}
		}
	};

	this._waterline = new Waterline();
	modelsManager.set('users', new UsersModel(this._waterline));

	servicesManager.set('authentication', new AuthenticationService());

	this._staticsController = new StaticsController(config.statics.path, config.statics.port);
	this._xmppController = new XMPPController(config.xmpp.host, config.xmpp.port, function() {});
};

Constructor.prototype._initialize = function () {
	var defaultUser = { user: 'user', password: 'password' };
	var self = this;

	this._waterline.initialize(this._configDB, function () {
		modelsManager.get('users').findOrCreate({user: defaultUser.user}, defaultUser).then(function () {
			self._staticsController.connect();
			self._xmppController.connect();
		});
	});
};

module.exports = Constructor;
