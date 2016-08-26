var templatesManager = require('./../../managers/templates-manager');

var AuthController = require('./../auth/auth-controller');

var Constructor = function () {
	this._template = templatesManager.get('menu');

	this._element = document.createElement('div');
	this._element.className = "container-fluid view-menu";
	this._element.innerHTML = this._template;

	var authElement = this._element.querySelector('#AUTH');
	authElement.innerHTML = '';
	this._loginController = new AuthController(authElement);
};


Constructor.prototype.render = function (context, data) {
	context.appendChild(this._element);

	this._loginController.update(data);
};

module.exports = Constructor;