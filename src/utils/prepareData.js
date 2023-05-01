const { lowerString, upperString } = require("./stringProcessor");
const { hashPass } = require(".//pass");
const { supportedLangs, defaultLang } = require("../../config.json");
const PATH = require("node:path");
const { STUDENT } = require("../API/student/student");

function prepareData(req, res, next) {
	const { path, query, body } = req;
	const data = Object.assign({}, body || {}, query || {});
	req.data = data;
	const method = PATH.parse(path)?.name;

	const params = STUDENT.find((item) => item.name === method)?.params || [];

	if (!params) {
		next();
		return;
	}

	for (const param of params) {
		if (!(param in data)) {
			const err = { code: 10002 };
			next(err);
			return err;
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

module.exports = prepareData;
