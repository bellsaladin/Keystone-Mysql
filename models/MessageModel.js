var keystone = require('keystone');
//var transform = require('model-transform');
var Types = keystone.Field.Types;

var MessageModel = new keystone.List('MessageModel', {'label' : 'Modèle message'});

MessageModel.add({
	name: { type: String, label: 'Nom', required: true, index: true },
  content: { type: Types.Textarea, label: 'Contenu', required: true, initial : true, note :'Il est possible d’utiliser les paramètres de configuration comme PLACEHOLDERS, par exemple : |APP_VERSION| '}
});

//transform.toJSON(MessageModel);
MessageModel.defaultColumns = 'name';
MessageModel.register();
