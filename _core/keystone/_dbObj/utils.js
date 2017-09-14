const Sequelize = require('sequelize');


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

function normalizeWhere(array){
	console.log('DBObj::Utils::normalizeWhere');
	for (var k in array){
	    console.log('typeof array[k] ');
	    console.log(typeof array[k] );
	    if (typeof array[k] !== 'object') {
	    	array[k] = array[k].toString();
	    }
	}
	return array;
}

module.exports = {
	transformTypeToSequlizeType: transformTypeToSequlizeType,
	normalizeWhere: normalizeWhere
};