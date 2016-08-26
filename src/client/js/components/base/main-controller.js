var page = require('page');

var MainView = require('./main-view');

var Constructor = function (context) {
	this._context = context;
	this._mainView = new MainView();

	this._setupRoutes();
};

Constructor.prototype._setupRoutes = function () {
	var self = this;

	page('*', function (context, next) {
		if (context.pathname === '/') {
			page('/home');
		} else {
			context.handled = true;
			// console.log('*', context);
			next();
		}
	});

	page('/home', function (context) {
		self._mainView.render(self._context, {route: context});
	});

	page.start();
};

module.exports = Constructor;
