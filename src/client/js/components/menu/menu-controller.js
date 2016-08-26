var MenuView = require('./menu-view');

var Constructor = function (context) {
	this._context = context;

	this._menuView = new MenuView();
};

Constructor.prototype.update = function (data) {

	this._menuView.render(this._context, data);
};

module.exports = Constructor;