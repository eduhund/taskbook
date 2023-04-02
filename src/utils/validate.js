const { lowerString } = require("../utils/lowString");
const { hashPass } = require("../utils/pass");
const { supportedLangs, defaultLang } = require("../../config.json");

const requireParams = {
	"/auth": ["email", "pass"],
};

function validate(res, ...args) {
	var valid = true;
	for (var i = 0; i < args.length; i++) {
		valid = valid && Boolean(args[i]);
	}
	if (!valid) {
		res.send({
			OK: false,
			error: {
				code: 10101,
				type: "invalid_request",
				description: "Missing required params",
			},
		});
	}
	return valid;
}

function paramsProcessor(req, res, next) {
	const params = req.body;
	const path = req.route?.path;
	(requireParams[path] || []).forEach((param) => {
		if (!(param in params)) {
			res.send({
				OK: false,
				error: {
					code: 10101,
					type: "invalid_request",
					description: "Missing required params",
				},
			});
			return;
		}
	});

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
