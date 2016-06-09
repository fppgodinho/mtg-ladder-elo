var Constructor = function (context, interval) {
  var self = this;

  function checkLoaded () {
  	if (context.readyState === 'complete') {
  		self.init();
  	} else {
  		setTimeout(checkLoaded, interval);
  	}
  }
  checkLoaded();
};

Constructor.prototype.init = function () {
	var element = window.document.createElement('div');
	element.innerHTML = 'Hello World!!';

	var body = window.document.querySelector('body');
	body.appendChild(element);
};

module.exports = Constructor;
