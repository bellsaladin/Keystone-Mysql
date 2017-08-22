/*var keystone = require('keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var CustomerActivity = new keystone.List('CustomerActivity',
                                        {'label' : 'Activité',
                                         'noedit' : true,
                                         'nocreate' : true,
                                         'nodelete' : true});

CustomerActivity.add({
  customer: { type: Types.Relationship, ref: 'Customer', label : 'Client'},
	operationDate: { type: String, label: 'Date opération'},
  numberOfSentSMS: { type: Number, label: 'Nbr SMS Envoyés'}
});

transform.toJSON(CustomerActivity);
CustomerActivity.defaultColumns = 'numberOfSentSMS';
CustomerActivity.register();*/

var keystone = require('keystone');
//var transform = require('model-transform');
var Types = keystone.Field.Types;

var CustomerActivity = new keystone.List('CustomerActivity',
                                          {defaultSort: '-operationDate'},
                                          {'label' : 'Activité',
                                           'noedit' : true,
                                           'nocreate' : true,
                                           'nodelete' : true, });

CustomerActivity.add({
	name: { type: String, required: false, index: true , hidden:true},
  numberOfSentSMS: { type: Number, label: 'Nbr SMS Envoyés'},
  operationDate: { type: Types.Datetime, label: 'Date opération', format : 'DD-MM-YYYY hh:mm:ss'},
  customer: { type: Types.Relationship, ref: 'Customer'}
});

//transform.toJSON(CustomerActivity);
CustomerActivity.defaultColumns = 'name|0%, operationDate, customer, numberOfSentSMS';
CustomerActivity.register();
