const { lowerString } = require("../utils/lowString");
const { hashPass } = require("../utils/pass");
const { supportedLangs, defaultLang } = require("../../config.json");
const { generateMessage } = require("./messageGenerator");

const requireParams = {
	["/api/v2/auth"]: ["email", "pass"],
	["/api/v2/createPassword"]: ["email", "pass", "verifyKey"],
	["/api/v2/getDashboard"]: ["accessToken"],
	["/api/v2/getModuleInfo"]: ["moduleId", "accessToken"],
	["/api/v2/getTask"]: ["taskId", "accessToken"],
	["/api/v2/getModuleStart"]: ["moduleId", "accessToken"],
	["/api/v2/getModuleFinal"]: ["moduleId", "accessToken"],
	["/api/v2/getLessonStart"]: ["lessonId", "accessToken"],
	["/api/v2/getLessonFinal"]: ["lessonId", "accessToken"],
	["/api/v2/getLessonsList"]: ["moduleId", "accessToken"],
	["/api/v2/getTasksList"]: ["lessonId", "accessToken"],
	["/api/v2/getDiploma"]: ["moduleId", "accessToken"],
	["/api/v2/setState"]: ["questionId", "state", "accessToken"],
	["/api/v2/checkTask"]: ["taskId", "isChecked", "protest", "accessToken"],
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
	const params = Object.keys(req.body).length !== 0 ? req.body : req.query;
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
