var _ = require('lodash');
var utils = require('keystone-utils');

/**
 * Adds one or more fields to the List
 * Based on Mongoose's Schema.add
 */
function add () {
	var add = function (obj, prefix) {
		prefix = prefix || '';
		var keys = Object.keys(obj);
		for (var i = 0; i < keys.length; ++i) {
			var key = keys[i];
			if (!obj[key]) {
				throw new Error(
					'Invalid value for schema path `' + prefix + key + '` in `' + this.key + '`.\n'
					+ 'Did you misspell the field type?\n'
				);
			}
			if (utils.isObject(obj[key]) && (!obj[key].constructor || obj[key].constructor.name === 'Object') && (!obj[key].type || obj[key].type.type)) {
				if (Object.keys(obj[key]).length) {
					// nested object, e.g. { last: { name: String }}
					// matches logic in mongoose/Schema:add
					this.schema.nested[prefix + key] = true;
					add(obj[key], prefix + key + '.');
				} else {
					addField(prefix + key, obj[key]); // mixed type field
				}
			} else {
				addField(prefix + key, obj[key]);
			}
		}
	}.bind(this);

	var addField = function (path, options) {
		if (this.isReserved(path)) {
			throw new Error('Path ' + path + ' on list ' + this.key + ' is a reserved path');
		}
		this.uiElements.push({
			type: 'field',
			/*  #######################################################
			// UNDERSTANDING :  the following function List.prototype.field (lib/list/field.js) is very important 
			//                                         it's where the adapted field is being created and the approriate fields added to schema based 
			//                                         on keystone's fieldType.
						    CHECK : Field.prototype.addToSchema (for each schema)
			//		     
			//			   
			####################################################### */ 
			field: this.field(path, options),
		});
	}.bind(this);

	var args = Array.prototype.slice.call(arguments);
	var self = this;

	// ######################################################################################################
	
	// Uderstanding : here you can see that all provided model args are being processed into ui Element 

	// ######################################################################################################

	_.forEach(args, function (def) {
		self.schemaFields.push(def);
		
		if (typeof def === 'string') {
			if (def === '>>>') {
				self.uiElements.push({
					type: 'indent',
				});
			} else if (def === '<<<') {
				self.uiElements.push({
					type: 'outdent',
				});
			} else {
				self.uiElements.push({
					type: 'heading',
					heading: def,
					options: {},
				});
			}
		} else {
			if (def.heading && typeof def.heading === 'string') {
				self.uiElements.push({
					type: 'heading',
					heading: def.heading,
					options: def,
				});
			} else {
				add(def);
			}
		}
	});

	return this;
}

module.exports = add;
