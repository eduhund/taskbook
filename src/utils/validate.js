// Deprecated

const { lowerString, upperString } = require("./stringProcessor");
const { hashPass } = require("../utils/pass");
const { supportedLangs, defaultLang } = require("../../config.json");
const { generateMessage } = require("./messageGenerator");

const requireParams = {
	["/api/v2/auth"]: ["email", "pass"],
	["/api/v2/checkPayment"]: ["paymentId"],
	["/api/v2/createPassword"]: ["email", "pass", "key"],
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
	["/api/v2/setControls"]: ["taskId", "controlsState", "accessToken"],
	["/api/v2/addComment"]: ["taskId", "comment", "protest", "accessToken"],
	["/api/v2/getCounselor"]: ["lang", "accessToken"],
};

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

	if ("moduleId" in params) {
		params.moduleId = upperString(params.moduleId);
	}

	if ("lessonId" in params) {
		params.lessonId = upperString(params.lessonId);
	}

	if ("taskId" in params) {
		params.taskId = upperString(params.taskId);
	}

	if ("questionId" in params) {
		params.questionId = upperString(params.questionId);
	}

	next();
}

module.exports = { paramsProcessor };
