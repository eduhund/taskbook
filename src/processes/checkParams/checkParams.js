const { log } = require("../../services/logger");
const { lowerString, upperString } = require("../../utils/stringProcessor");
const { hashPass } = require("../../utils/pass");
const { supportedLangs, defaultLang } = require("../../../config.json");
const { generateMessage } = require("../../utils/messageGenerator");
const PATH = require("node:path");
const STUDENT = require("../../API/student/student");

/*
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
*/

function checkParams(req, res, next) {
	const { path, query, body } = req;
	const data = Object.assign({}, body || {}, query || {});
	const method = PATH.parse(path)?.name;

	const params = STUDENT.find((item) => item.name === method)?.params || [];

	if (!params) {
		next();
	}

	for (const param of params) {
		if (!(param in data)) {
			res.status(400);
			res.json(generateMessage(10001));
			return;
		}
	}

	const keyHandlers = {
		email: lowerString,
		pass: hashPass,
		lang: (value) => (supportedLangs.includes(value) ? value : defaultLang),
		moduleId: upperString,
		lessonId: upperString,
		taskId: upperString,
		questionId: upperString,
	};

	for (const [key, value] of Object.entries(data)) {
		if (key in keyHandlers) {
			params[key] = keyHandlers[key](value);
		}
	}

	next();
}

module.exports = checkParams;
