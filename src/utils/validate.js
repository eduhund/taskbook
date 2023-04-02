const { lowerString } = require("../utils/lowString");
const { hashPass } = require("../utils/pass");
const { supportedLangs, defaultLang } = require("../../config.json");
const { generateMessage } = require("./messageGenerator");

const requireParams = {
	["/api/v2/auth"]: ["email", "pass"],
};

function validate(res, ...args) {
	var valid = true;
	for (var i = 0; i < args.length; i++) {
		valid = valid && Boolean(args[i]);
	}
	if (!valid) {
		res.send(generateMessage(10001));
	}
	return valid;
}

function paramsProcessor(req, res, next) {
	const params = req.body;
	const path = req.path;
	for (const param of requireParams[path] || []) {
		if (!(param in params)) {
			res.status(400);
			res.send(generateMessage(10001));
			return;
		}
	}

	if ("email" in params) {
		params.email = lowerString(params.email);
	}

	if ("pass" in params) {
		params.pass = hashPass(params.pass);
	}

	if ("lang" in params) {
		params.lang = supportedLangs.includes(params.lang)
			? params.lang
			: defaultLang;
	}

	next();
}

module.exports = { validate, paramsProcessor };
