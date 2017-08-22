var babelify = require('babelify');
var browserify = require('browserify-middleware');
var _ = require('underscore');
var keystone = require('keystone');

var clientConfig = {
	commonPackages: [
		'elemental',
		'react',
		'react-addons-css-transition-group',
		'react-dom',
		'store-prototype',
		'xhr',
	],
};

// Setup Route Bindings
exports = module.exports = function (app) {

	// Bundle commonw packages
	app.get('/js/packages.js', browserify(clientConfig.commonPackages, {
		cache: true,
		precompile: true,
	}));

	// Serve script bundles
	app.use('/js', browserify('./client/scripts', {
		external: clientConfig.commonPackages,
		transform: [babelify.configure({
			plugins: [require('babel-plugin-transform-object-rest-spread'), require('babel-plugin-transform-object-assign')],
			presets: [require('babel-preset-es2015'), require('babel-preset-react')],
		})],
	}));

	// Views
	app.get('/api', function (req, res) {
		res.render('api', {
			Keystone: {
				csrf_header_key: keystone.security.csrf.CSRF_HEADER_KEY,
				csrf_token_value: keystone.security.csrf.getToken(req, res),
			},
		});
	});

	app.get('/sms-app/logSmsActivity', function(req, res){
		var p_username = req.query.username;
		var p_nbrSmsSent = req.query.varnbrsms;
		var p_dateLastOperation = req.query.vardateop;

    		var msg  = "";
    		var code = 0;

		keystone.mongoose.model('Customer').findOne({ 'username': p_username },
																							 function (err, customer) {
			if (err) return handleError(err);
			console.log('%s', customer) // Space Ghost is a talk show host.
			if(!customer){
				code = 0;
				msg = "Le nom d'utilisateur fourni ne correspond à aucun client !";
			}else{

				//keystone.mongoose.model('CustomerActivity').save()
				var CustomerActivityList = keystone.list('CustomerActivity');
				var customerActivity = new CustomerActivityList.model();

				customerActivity.customer        = customer;
				customerActivity.operationDate   = p_dateLastOperation;
				customerActivity.numberOfSentSMS = (!p_nbrSmsSent)?p_nbrSmsSent:0;
				customerActivity.save(function (err) {
					if (err) {
						console.error('Error saving customer activity to the database');
						console.error(err);
					} else {
						console.log('Saved \'Customer activity\' to the database');
					}
				});
				code = 1;
				msg = 'L\'activité du client a été enregistrée';
			}

			res.send(code + '|||' + msg);
			return;
		}); // END : FIND CUSTOMER
	});

	app.get('/sms-app/verifyAccess', function(req, res){
		var p_username = req.query.username;
		var p_password = req.query.pw;
		var p_macAddress = req.query.mac;
		var p_version = req.query.version;
		var p_nbrSmsSent = req.query.varnbrsms;
		var p_dateLastOperation = req.query.vardateop;

		var msg = "";
		var code = 0;
		var APP_VERSION = ''; // gathered from the database
		var CONTACT_PHONE = '';
		var CONTACT_EMAIL = '';
    		var soldeSMS = 0;

		var MSG_ERROR_BAD_CREDENTIALS = '';
		var MSG_ERROR_LOCKED_ACCOUNT = '';
		var MSG_ERROR_OLD_VERSION = '';
		var MSG_ERROR_UNAUTHORIZED_MACHINE = '';
		var MSG_INFO_DEMO_MODE = '';

		keystone.mongoose.model('MessageModel').find({},
		 /*'username password name macAddress soldeSMS isBloqued blockReason',*/
		 function (err, messagesModels) {

			 // check if required data was found
 			if(!messagesModels
 				|| !(_.find(messagesModels, function(obj){ return obj.name == 'ERROR_BAD_CREDENTIALS'; }))
 				|| !(_.find(messagesModels, function(obj){ return obj.name == 'ERROR_LOCKED_ACCOUNT'; }))
				|| !(_.find(messagesModels, function(obj){ return obj.name == 'ERROR_OLD_VERSION'; }))
				|| !(_.find(messagesModels, function(obj){ return obj.name == 'ERROR_UNAUTHORIZED_MACHINE'; }))
 				|| !(_.find(messagesModels, function(obj){ return obj.name == 'INFO_DEMO_MODE'; }))
 			){
 				code = -99;
 				msg = "Erreur : Modèles de messages non trouvés. \n "
 						+ "Verify also that all the required message ('ERROR_BAD_CREDENTIALS', 'ERROR_LOCKED_ACCOUNT'...) exist ";
 				res.send(code + '|||' + msg);
 				return;
 			}else{
 				MSG_ERROR_BAD_CREDENTIALS      = _.find(messagesModels, function(obj){ return obj.name == 'ERROR_BAD_CREDENTIALS'; }).content;
 				MSG_ERROR_LOCKED_ACCOUNT       = _.find(messagesModels, function(obj){ return obj.name == 'ERROR_LOCKED_ACCOUNT'; }).content;
 				MSG_ERROR_OLD_VERSION 			   = _.find(messagesModels, function(obj){ return obj.name == 'ERROR_OLD_VERSION'; }).content;
				MSG_ERROR_UNAUTHORIZED_MACHINE = _.find(messagesModels, function(obj){ return obj.name == 'ERROR_UNAUTHORIZED_MACHINE'; }).content;
				MSG_INFO_DEMO_MODE 						 = _.find(messagesModels, function(obj){ return obj.name == 'INFO_DEMO_MODE'; }).content;
 			}


			keystone.mongoose.model('ConfigParameter').find({},
																								 /*'username password name macAddress soldeSMS isBloqued blockReason',*/
																								 function (err, configParameters) {
				// check if required data was found
				if(!configParameters
					|| !(_.find(configParameters, function(obj){ return obj.name == 'APP_VERSION'; }))
					|| !(_.find(configParameters, function(obj){ return obj.name == 'CONTACT_PHONE'; }))
					|| !(_.find(configParameters, function(obj){ return obj.name == 'CONTACT_EMAIL'; }))
				){
					code = -99;
					msg = "Erreur : Paramètre de configuration non trouvés. \n "
						  + "Verify also that all the required config parameters ('APP_VERSION', 'CONTACT_EMAIL' and 'CONTACT_PHONE') exist ";
					res.send(code + '|||' + msg);
					return;
				}else{
					APP_VERSION   = _.find(configParameters, function(obj){ return obj.name == 'APP_VERSION'; }).value;
					CONTACT_PHONE = _.find(configParameters, function(obj){ return obj.name == 'CONTACT_PHONE'; }).value;
					CONTACT_EMAIL = _.find(configParameters, function(obj){ return obj.name == 'CONTACT_EMAIL'; }).value;
				}

				keystone.mongoose.model('Customer').findOne({ 'username': p_username, 'password' : p_password },
																									 /*'username password name macAddress soldeSMS isBloqued blockReason',*/
																									 function (err, customer) {
					if (err) return handleError(err);
					console.log('%s', customer) // Space Ghost is a talk show host.
					if(!customer){
						code = 0;
						msg = MSG_ERROR_BAD_CREDENTIALS;
					}
					else if(APP_VERSION != p_version ){
			      code = -3;
			      msg = MSG_ERROR_OLD_VERSION;
			    }
					else if(customer.macAddress && p_macAddress != customer.macAddress){
						code = -2;
						msg = MSG_ERROR_UNAUTHORIZED_MACHINE;
					}else if(customer.isBlocked){
						code = -1;
						msg = MSG_ERROR_LOCKED_ACCOUNT + ' Raison du blocage : ' + customer.blockReason;
					}else if(customer.demoUseOnly){
						code = 2;
			      msg = MSG_INFO_DEMO_MODE;
						soldeSMS = customer.soldeSMS;
					}else if(!customer.isBlocked){
						code = 1;
						msg = 'Connexion autorisée';
						soldeSMS = customer.soldeSMS;
						// if the mac address is not yet captured
						if(!customer.macAddress){
								customer.macAddress = p_macAddress;
								customer.save(function (err) {
							    if (err) return handleError(err);
							    //res.send(customer);
									console.log('Customer data (\' Mac Address\') updated ! %s', customer)
							  });
						}
					}
					//keystone.mongoose.model('CustomerActivity').save()
					var CustomerActivityList = keystone.list('CustomerActivity');
					var customerActivity = new CustomerActivityList.model();

					customerActivity.customer        = customer;
					customerActivity.operationDate   = p_dateLastOperation;
					customerActivity.numberOfSentSMS = p_nbrSmsSent;
					customerActivity.save(function (err) {
						if (err) {
							console.error('Error adding customer activity to the database');
							console.error(err);
						} else {
							console.log('Saved \'Customer activity\' to the database');
						}
					});
					// PROCESS AND REPLACE ALL PLACEHOLDERS FOR
					_.each(configParameters, function(parameter) {
    					msg = msg.replace('|'+parameter.name+'|', parameter.value);
					});

					res.send(code + '|||' + msg + '|||' + soldeSMS);
					return;
				}); // END : FIND CUSTOMER
			}); // END : FIND CONFIG PARAMETERS
		}); // END : FIND MESSAGES MODELS

	});

	// Views
	app.use(function (req, res) {
		res.render('index');
	});

};

function authorizedMac(){
	return true;
}

function bloquedAccess(){
	return false;
}
function demoAccess(){
	return false;
}
