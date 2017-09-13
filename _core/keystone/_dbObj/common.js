const Sequelize = require('sequelize');

var sequelizeInstance = new Sequelize('mysql://root:root@localhost:3306/sequelize_test');

module.exports = {
  sequelizeInstance : sequelizeInstance
}