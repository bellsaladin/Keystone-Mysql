var sequelizeInstance = require('./common.js').sequelizeInstance;
const Utils = require('./utils.js');

const Sequelize = require('sequelize');

var schema = function (arg1, arg2) {
	this.fields = {};
	this.nested = {};
	this.virtuals = [];
	console.log('dbObj::Schema::constructor')
	console.log(arg1)
	console.log(arg2)
};

schema.Types = {};
schema.Types.ObjectId = Sequelize.INTEGER;

schema.prototype.add = function (path, options) {
	console.log('dbObj::Schema::add')
};

schema.prototype.path = function (key, opts) {
	var self = this;
	/*if (typeof path ==='array'){
		path.forEach(function (key, val) {
			self.path(key,val);
		});
	}*/

	console.log("dbObj::Schema::path")
	console.log(key)
	console.log(opts)

	var path = {};
	path.set = function (key, value) {
		//console.log("dbObj::Schema::virtual")
		console.log(key)
		console.log(value)
	};

	if( opts === undefined) return path;
	if (typeof opts ==='string') opts = {type : opts}; // opts adapter

	this.fields[key] = {type : Utils.transformTypeToSequlizeType(opts.type)   }
	console.log('this.fields')
	console.log(this.fields)
	/*if ('required' in opts)
		this.fields[path].allowNull = (opts.required)?false:true;
	if ('defaultValue' in opts)
		this.fields[path].defaultValue = (opts.defaultValue)?false:true;
	if ('autoIncrement' in opts)
		this.fields[path].autoIncrement = (opts.autoIncrement)?true:false;*/

	return path;
};

schema.prototype.virtual = function (path, options) {
	console.log("dbObj::Schema::virtual")
	console.log(path)

	var virtual = {};
	virtual.get = function (key) {
		//console.log("dbObj::Schema::virtual")
		console.log(key)
	};
	virtual.set = function (key, value) {
		//console.log("dbObj::Schema::virtual")
		console.log(key)
		console.log(value)
	};
	return virtual;
};

schema.prototype.method = function (req, res, ops) {};
schema.prototype.pre = function (arg1, arg2, arg3) {};


schema.prototype.virtual.get = function (key) {
	console.log("dbObj::Schema::virtual::get")
	console.log(key)
};

schema.prototype.virtual.set = function (key, value) {
	console.log("dbObj::Schema::virtual::set")
	console.log(key)
	console.log(value)
};

schema.prototype.methods = {};

schema.prototype.methods.toCSV = function (){
	console.log('dbObj::Schema::methods::toCSV')
};

module.exports = schema;