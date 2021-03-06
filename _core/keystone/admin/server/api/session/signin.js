var utils = require('keystone-utils');
var session = require('../../../../lib/session');

function signin (req, res) {
	var keystone = req.keystone;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
	if (!req.body.email || !req.body.password) {
		return res.status(401).json({ error: 'email and password required' });
	}
	var User = keystone.list(keystone.get('user model'));
	//var emailRegExp = new RegExp('^' + utils.escapeRegExp(req.body.email) + '$', 'i');
	User.model.findOne({ email: req.body.email.trim() }).exec(function (err, user) {
		console.log('useruseruseruser')
		console.log(user._)
		if (user) {
			keystone.callHook(user, 'pre:signin', req, function (err) {
				if (err) return res.status(500).json({ error: 'pre:signin error', detail: err });
				
				// ####### 	#######	#######	#######	#######	#######
				// @NOTE : compare function here is called from password Field Type (PasswordType.js)
				// In mongoose it's possible to define custom types and the functions are automatically bound, something similar should be done with DbObj


				user._.password.compare(req.body.password, function (err, isMatch) {
					if (isMatch) {
						session.signinWithUser(user, req, res, function () {
							keystone.callHook(user, 'post:signin', req, function (err) {
								if (err) return res.status(500).json({ error: 'post:signin error', detail: err });
								res.json({ success: true, user: user });
							});
						});
					} else if (err) {
						return res.status(500).json({ error: 'bcrypt error', detail: err });
					} else {
						return res.status(401).json({ error: 'invalid details' });
					}
				});
			});
		} else if (err) {
			return res.status(500).json({ error: 'database error', detail: err });
		} else {
			return res.status(401).json({ error: 'invalid details' });
		}
	});
}

module.exports = signin;
