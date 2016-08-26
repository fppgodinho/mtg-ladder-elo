var MenuController = require('./../menu/menu-controller');
var templatesManager = require('./../../managers/templates-manager');

var Constructor = function () {
	this._template = templatesManager.get('main');

	this._element = document.createElement('div');
	this._element.className = "container-fluid view-main";
	this._element.innerHTML = this._template;

	var menuElement = this._element.querySelector('#MENU');
	menuElement.innerHTML = '';
	this._menuController = new MenuController(menuElement);

};

Constructor.prototype.render = function (context, data) {
	context.appendChild(this._element);

	this._menuController.update(data);
};

module.exports = Constructor;