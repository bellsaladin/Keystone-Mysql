//******************************************************************************************************************************

// _dbObj logic (which is going to be a wrapper of mongoose which uses SequelizeJs)

// ******************************************************************************************************************************
const EventEmitter = require('events');

var sequelizeInstance = require('./common.js').sequelizeInstance;

class MyEmitter extends EventEmitter {};


var KeystoneFieldTypes = require('../lib/fieldTypes');

const Sequelize = require('sequelize');

var dbObj = function () {	
	this.connection = new MyEmitter();
	
	this.models = [];

};

dbObj.prototype.Schema = require('./schema.js');

dbObj.prototype.model = require('./model.js');

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

var dbObj = module.exports = new dbObj();
