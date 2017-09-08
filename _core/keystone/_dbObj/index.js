//******************************************************************************************************************************

// _dbObj logic (which is going to be a wrapper of mongoose which uses SequelizeJs)

// ******************************************************************************************************************************
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {};


var KeystoneFieldTypes = require('../lib/fieldTypes');

const Sequelize = require('sequelize');

var sequelizeInstance = new Sequelize('mysql://root:root@localhost:3306/sequelize_test');

var dbObj = function () {	
	this.connection = new MyEmitter();
	
	this.models = [];

	this.Schema = function (arg1, arg2) {
		this.fields = {};
		this.nested = {};
		this.virtuals = [];
		console.log('dbObj::Schema::constructor')
		console.log(arg1)
		console.log(arg2)
	};

	this.Schema.Types = {};
	this.Schema.Types.ObjectId = Sequelize.INTEGER;
	
	this.Schema.prototype.add = function (path, options) {
		console.log('dbObj::Schema::add')
	};

	this.Schema.prototype.path = function (key, opts) {
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

		this.fields[key] = {type : transformTypeToSequlizeType(opts.type)   }
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

	this.Schema.prototype.virtual = function (path, options) {
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

	this.Schema.prototype.method = function (req, res, ops) {};
	this.Schema.prototype.pre = function (arg1, arg2, arg3) {};


	this.Schema.prototype.virtual.get = function (key) {
		console.log("dbObj::Schema::virtual::get")
		console.log(key)
	};

	this.Schema.prototype.virtual.set = function (key, value) {
		console.log("dbObj::Schema::virtual::set")
		console.log(key)
		console.log(value)
	};

	this.Schema.prototype.methods = {};

	this.Schema.prototype.methods.toCSV = function (){
		console.log('dbObj::Schema::methods::toCSV')
	};


	this.model = function (key, schema) {
		if(schema === undefined) return this.models[key];
		console.log('dbObj::model::constructor')
		console.log(key)
		console.log(schema.fields)
		const model = sequelizeInstance.define(key, schema.fields);
		model.sync({force: true}).then(() => {
		  console.log('model synced')
		});
		this.models[key] = model;

		model.on = function (event, callback) {
			console.log('Sequelize::model::on')
			console.log(event)
			console.log(callback)
		};

		/*.then(() => {
		  return User.create({
		    firstName: 'John',
		    lastName: 'Hancock'
		  });
		});*/
		return model;
	};

};



dbObj.prototype.path = function (path, options) {
	console.log(path)
};


dbObj.prototype.connect = function (){
  	sequelizeInstance
	  .authenticate()
	  .then(() => {
	    console.log('Connection has been established successfully.');
	    this.connection.emit('open');
	  })
	  .catch(err => {
	    console.error('Unable to connect to the database:', err);
	    this.connection.emit('error', err);
	  });
};

/*dbObj.prototype.connection.on('error', () => {
  console.log('an event occurred!');
});*/

/* Util function : Adapter : Mongoose Field types to Sequelize */
function transformTypeToSequlizeType(type){
	if( type === String ){
		return Sequelize.STRING;
	}
	if( type === Number ){
		return Sequelize.INTEGER;
	}

	if( type === Boolean ){
		return Sequelize.BOOLEAN;
	}

	if( type === Date ){
		return Sequelize.DATE;
	}

	// IMPORTANT : for other types (ex: mongoose relationships based on models : put integer for foreing keys)
	return Sequelize.INTEGER;
}

var dbObj = module.exports = new dbObj();
