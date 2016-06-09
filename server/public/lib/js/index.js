(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.clientIndex = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Application = require('./js/application');
var instance = new Application(window.document, 10);

},{"./js/application":2}],2:[function(require,module,exports){
var Constructor = function (context, interval) {
  var self = this;

  function checkLoaded() {
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

},{}]},{},[1])(1)
});