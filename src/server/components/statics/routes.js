var Constructor = function (statics, index) {
	this._statics = statics;
	this._index = index;
}

Constructor.prototype.logger = function (req, res, next) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var path = req.protocol + '://' + req.get('host') + req.originalUrl;
	// console.log('STATIC ASSET SERVED:', ip, path);
	next();
}

Constructor.prototype.staticAssets = function (req, res) {
	var url = req.baseUrl.split('lib')[1];
	res.sendFile(this._statics + url);
};

Constructor.prototype.staticIndex = function (req, res) {
	res.sendFile(this._index);
};



module.exports = Constructor;