var sequelizeInstance = require('./common.js').sequelizeInstance;

var model  = function (key, schema) {
	if(schema === undefined) return this.models[key];
	console.log('dbObj::model::constructor')
	console.log(key)
	console.log(schema.fields)
	const model = sequelizeInstance.define(key, schema.fields);
	
	var forceSync = false;

	model.sync({force: forceSync}).then(() => {
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

module.exports = model;