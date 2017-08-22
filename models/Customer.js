var keystone = require('keystone');
//var transform = require('model-transform');
var Types = keystone.Field.Types;

var Customer = new keystone.List('Customer', {'label' : 'Client'});

Customer.add({
	name: { type: Types.Name, label: 'Raison sociale  / Nom client', required: true, index: true },
	phone: { type: String, label: 'Num Tél.', index: true },
/*, 'Permissions', {*/
	soldeSMS: { type: Number, label: 'Solde SMS'},
	demoUseOnly: { type: Boolean, label: 'Mode de démonstration', index: true },
	isBlocked: { type: Boolean, label: 'Compte bloqué', index: true },
	blockReason: { type: Types.Textarea, label: 'Raison du blocage', index: true , dependsOn: { isBlocked: true } },
/*}*/
}, 'Infos d\'accès', {
	username: { type: String, label: 'Nom d\'utilisateur'},
	password: { type: String, label: 'Mot de passe'},
	macAddress: { type: String, noedit: true },
},
'Extra', {	notes: { type: Types.Markdown, collapse: true } });

//transform.toJSON(Customer);
Customer.defaultColumns = 'name, phone';
Customer.register();
