var keystone = require('keystone');
//var transform = require('model-transform');
var Types = keystone.Field.Types;

var ConfigParameter = new keystone.List('ConfigParameter', {'label' : 'Paramètres de configuration'});

ConfigParameter.add({
	name: { type: String, required: true, index: true, note : 'Il est possible d’utiliser ce nom dans les modèles de message comme paramètre de configuraiton \n par exemple : Veuillez nous contacter sur |CONTACT_EMAIL| '},
  value: { type: String}
});

//transform.toJSON(ConfigParameter);
ConfigParameter.defaultColumns = 'name, value';
ConfigParameter.register();
