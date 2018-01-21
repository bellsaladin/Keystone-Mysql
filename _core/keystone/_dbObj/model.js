const Utils = require('./utils.js');
var sequelizeInstance = require('./common.js').sequelizeInstance;

var Model  = function (key, schema) {
	if(schema === undefined) return this.models[key];
	console.log('dbObj::model::constructor')
	console.log(key)
	console.log(schema.fields)
	const model = {};
	model.sequelizeModel = sequelizeInstance.define(key, schema.fields);
	
	var forceSync = false;

	model.sequelizeModel.sync({force: forceSync}).then(() => {
	  console.log('model synced')
	});

	model.findOne = function (where, attributes, callback) {
		var self = this;
		console.log('DbObj::model::findOne');
		console.log(where);
		console.log(attributes);
		this.where = (where != null)? Utils.normalizeWhere(where) : null;
		this.attributes = (attributes != null)? attributes.split(" ") : null; // mongoose params are passes as str with attributes splited by a space
		var query = {};

		query.exec = function(callback){
			self.sequelizeModel.findOne({
			  where: self.where,
			  //attributes: ['id', [self.attributes]],
			  // FIXME : test only
			  attributes: self.attributes,
			  raw: true,
			}).then(object => {
				console.log('SequelizeModel::then')
				console.log(object)
				// FIXME : sould be put somewhere to be more generic
				if('password' in object){

					console.log('Password.prototype.compare 1')
					/* FIXME : This part should be placed somewhere, where primitive values would be convert to special prototype object with some extra logic like 'compare' in Password Type */
					function Password(v) {
					  this.value = v;
					}
					/* returns primitive value of an object */
					Password.prototype.valueOf = function() {
						console.log('Password.prototype.valueOf')
					  return this.value;
					}

					Password.prototype.compare = function(compareVal, callback) {
						console.log('Password.prototype.compare');
						var isMatch = (this.value != compareVal)?true:false;
						var err = null; // error should be thrown if null;
					  	callback ( null, isMatch);
					}

					object._ = {};
					object._.password = new Password(object.password)
				}

				callback(null, object);
			}).catch(function (err) {
				console.log('SequelizeModel::catch');
				console.log(err)
				callback(err, null);
			});
		};

		if(callback != null) query.exec();
		return query;

	}

	model.findById = function (id, attributes, callback) {
		var self = this;
		console.log('DbObj::model::findOne');
		console.log(attributes);
		this.attributes = (attributes != null)? attributes.split(" ") : null; // mongoose params are passes as str with attributes splited by a space
		var query = {};

		query.exec = function(callback){
			self.sequelizeModel.findOne({
			  where: { id: id },
			  //attributes: ['id', [self.attributes]],
			  // FIXME : test only
			  attributes: self.attributes,
			  raw: true,
			}).then(object => {
				console.log('SequelizeModel::then')
				console.log(object)
				// FIXME : sould be put somewhere to be more generic
				if('password' in object){

					console.log('Password.prototype.compare 1')
					/* FIXME : This part should be placed somewhere, where primitive values would be convert to special prototype object with some extra logic like 'compare' in Password Type */
					function Password(v) {
					  this.value = v;
					}
					/* returns primitive value of an object */
					Password.prototype.valueOf = function() {
						console.log('Password.prototype.valueOf')
					  return this.value;
					}

					Password.prototype.compare = function(compareVal, callback) {
						console.log('Password.prototype.compare');
						// FIXME : implement here hash logic
						var isMatch = (this.value != compareVal)?true:false;
						var err = false; // error should be thrown if null;
					  	callback (err, isMatch);
					}
					object.get = function(path){
						console.log('object.get (mongoose get function)');
						console.log('path');
						if(path in object)
							return object[path];
						return '[DBObj:Object Unknow value for path "' + path + '" ]';
					}
					object._ = {};
					object._.password = new Password(object.password)
				}

				callback(null, object);
			}).catch(function (err) {
				console.log('SequelizeModel::catch');
				console.log(err)
				callback(err, null);
			});
		};

		if(callback != null) query.exec();
		return query;
	};

	//this.models[key] = model;

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

module.exports = Model;