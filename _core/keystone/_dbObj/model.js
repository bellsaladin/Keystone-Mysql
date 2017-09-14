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
			  attributes: self.attributes,
			}).then(object => {
				console.log('SequelizeModel::then')
				console.log(object)
				object._ = object;
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