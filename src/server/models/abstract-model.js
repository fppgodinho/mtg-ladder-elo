function Constructor(waterline) {
	this._waterline = waterline;
	this._schema = {
		identity: 'abstract'
	};
}

Constructor.prototype._getInstance = function () {
	return this._waterline.collections[this._schema.identity];
};

Constructor.prototype.find = function (criteria, callback) {
	return this._getInstance().find(criteria, callback);
};

Constructor.prototype.findOne = function (criteria, callback) {
	return this._getInstance().findOne(criteria, callback);
};

Constructor.prototype.create = function (criteria, callback) {
	return this._getInstance().create(criteria, callback);
};

Constructor.prototype.findOrCreate = function (criteria, values, callback) {
	return this._getInstance().findOrCreate(criteria, values, callback);
};

Constructor.prototype.update = function (criteria, values, callback) {
	return this._getInstance().update(criteria, values, callback);
};

Constructor.prototype.destroy = function (criteria, callback) {
	return this._getInstance().destroy(criteria, callback);
};

Constructor.prototype.query = function (query, data, callback) {
	return this._getInstance().query(query, data, callback);
};

module.exports = Constructor;