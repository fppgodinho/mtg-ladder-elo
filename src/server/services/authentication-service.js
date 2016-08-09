var modelsManager = require('./../managers/models-manager');

var Constructor = function () {
	this._users = modelsManager.get('users');
};

Constructor.ERROR = 'Error';

Constructor.prototype.validate = function (username, password, callback) {
	this._users.findOne({user: username}).then(function (user) {
		if (user.password === password) {
			callback();
		} else {
			callback(Constructor.ERROR);
		}
	});
};

module.exports = Constructor;
