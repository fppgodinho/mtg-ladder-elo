// var serviceManager = require('./../../managers/services-manager');
var templatesManager = require('./../../managers/templates-manager');
var util = require('util');

var EventEmitter = require('events');
var AuthEvent = require('./auth-event');

var Constructor = function () {
	// this._sessionService = serviceManager.get('session');
	// this._sessionService.on(SessionEvent.CHANGED, this._checkSession.bind(this));

	this._template = templatesManager.get('logout');

	this._element = document.createElement('div');
	this._element.className = "view-logout";
	this._element.innerHTML = this._template;

	this._usernameElement = this._element.querySelector('#USERNAME');
	this._submitElement = this._element.querySelector('#SUBMIT');
	this._submitElement.addEventListener('click', this._handleSubmit.bind(this));
	this._usernameElement = this._element.querySelector('#USERNAME');
};
util.inherits(Constructor, EventEmitter);

Constructor.prototype._handleSubmit = function () {
	this.emit(AuthEvent.LOGOUT);
};

Constructor.prototype.render = function (context, data) {
	this._usernameElement.innerText = data.username

	context.appendChild(this._element);
};

module.exports = Constructor;