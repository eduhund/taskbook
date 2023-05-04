const { lowerString, upperString } = require("../../utils/stringProcessor");
const { hashPass } = require("../../utils/pass");
const { lang } = require("../../../config.json");
const PATH = require("node:path");
const { STUDENT } = require("../../API/student/student");

function prepareRequestData(req, res, next) {
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
		lang: (value) => (lang.supported.includes(value) ? value : lang.default),
		moduleId: upperString,
		lessonId: upperString,
		taskId: upperString,
		questionId: upperString,
		state: (value) => {
			if (typeof (value === "object" && Object.keys(value).length !== 0)) {
				return value;
			} else {
				const err = { code: 10003 };
				next(err);
				return err;
			}
		},
	};

	for (const [key, value] of Object.entries(data)) {
		if (key in keyHandlers) {
			data[key] = keyHandlers[key](value);
		}
	}

	next();
}

module.exports = prepareRequestData;
