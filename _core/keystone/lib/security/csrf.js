var crypto = require('crypto');
var scmp = require('scmp');
var utils = require('keystone-utils');

// The DISABLE_CSRF environment variable is available to automatically pass
// CSRF validation. This is useful in development scenarios where you want to
// restart the node process and aren't using a persistent session store, but
// should NEVER be set in production environments!!
var DISABLE_CSRF = process.env.DISABLE_CSRF === 'true';

exports.TOKEN_KEY = '_csrf';
exports.LOCAL_KEY = 'csrf_token_key';
exports.LOCAL_VALUE = 'csrf_token_value';
exports.SECRET_KEY = exports.TOKEN_KEY + '_secret';
exports.SECRET_LENGTH = 10;
exports.CSRF_HEADER_KEY = 'x-csrf-token';
exports.XSRF_HEADER_KEY = 'x-xsrf-token';
exports.XSRF_COOKIE_KEY = 'XSRF-TOKEN';

function tokenize (salt, secret) {
	return salt + crypto.createHash('sha1').update(salt + secret).digest('hex');
}

exports.createSecret = function () {
	return crypto.pseudoRandomBytes(exports.SECRET_LENGTH).toString('base64');
};

exports.getSecret = function (req) {
	return req.session[exports.SECRET_KEY] || (req.session[exports.SECRET_KEY] = exports.createSecret());
};

exports.createToken = function (req) {
	return tokenize(utils.randomString(exports.SECRET_LENGTH), exports.getSecret(req));
};

exports.getToken = function (req, res) {
	res.locals[exports.LOCAL_VALUE] = res.locals[exports.LOCAL_VALUE] || exports.createToken(req);
	res.cookie(exports.XSRF_COOKIE_KEY, res.locals[exports.LOCAL_VALUE]);
	return res.locals[exports.LOCAL_VALUE];
};

exports.requestToken = function (req) {
	if (req.body && req.body[exports.TOKEN_KEY]) {
		return req.body[exports.TOKEN_KEY];
	} else if (req.query && req.query[exports.TOKEN_KEY]) {
		return req.query[exports.TOKEN_KEY];
	} else if (req.headers && req.headers[exports.XSRF_HEADER_KEY]) {
		return req.headers[exports.XSRF_HEADER_KEY];
	} else if (req.headers && req.headers[exports.CSRF_HEADER_KEY]) {
		return req.headers[exports.CSRF_HEADER_KEY];
	} else if (req.cookies && req.cookies[exports.XSRF_COOKIE_KEY]) {
		return req.cookies[exports.XSRF_COOKIE_KEY];
	}
	return '';
};

exports.validate = function (req, token) {
	// Allow environment variable to disable check
	if (DISABLE_CSRF) return true;
	if (arguments.length === 1) {
		token = exports.requestToken(req);
	}
	if (typeof token !== 'string') {
		return false;
	}
	return scmp(
		token,
		tokenize(
			token.slice(0, exports.SECRET_LENGTH),
			req.session[exports.SECRET_KEY]
		)
	);
};

exports.middleware = {
	init: function (req, res, next) {
		res.locals[exports.LOCAL_KEY] = exports.LOCAL_VALUE;
		exports.getToken(req, res);
		next();
	},
	validate: function (req, res, next) {
		// Allow environment variable to disable check
		if (DISABLE_CSRF) return next();
		// Bail on safe methods
		if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
			return next();
		}
		// Validate token
		if (exports.validate(req)) {
			next();
		} else {
			res.statusCode = 403;
			next(new Error('CSRF token mismatch'));
		}
	},
};
