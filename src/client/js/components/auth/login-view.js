var templatesManager = require('./../../managers/templates-manager');
var util = require('util');

var EventEmitter = require('events');
var AuthEvent = require('./auth-event');

var Constructor = function () {
	this._template = templatesManager.get('login');

	this._element = document.createElement('div');
	this._element.className = "view-login";
	this._element.innerHTML = this._template;

	this._submitElement = this._element.querySelector('#SUBMIT');
	this._submitElement.addEventListener('click', this._handleSubmit.bind(this));
	this._usernameElement = this._element.querySelector('#USERNAME');
	this._passwordElement = this._element.querySelector('#PASSWORD');
};
util.inherits(Constructor, EventEmitter);

Constructor.prototype._handleSubmit = function () {
	this.emit(AuthEvent.LOGIN, this._usernameElement.value, this._passwordElement.value);
};

Constructor.prototype.render = function (context, data) {
	context.appendChild(this._element);
};

module.exports = Constructor;