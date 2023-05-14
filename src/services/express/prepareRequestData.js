const { lowerString, upperString } = require("@utils/stringProcessor");
const { hashPass } = require("@utils/pass");
const { lang } = require("../../../config.json");
const PATH = require("node:path");
const { STUDENT } = require("@StudentAPI");

/***
 * Function validates lang param.
 *
 * @param {String} userLang Requested user language code
 *
 * @returns {String} User language code or default language code
 */
function validateLang(userLang) {
	return lang.supported.includes(userLang) ? userLang : lang.default;
}

/***
 * Function validates state param.
 *
 * @param {Object} state Changed items in task's state
 * @param {Function} next Express middleware next function
 *
 * @returns {Object} Updated state of the task
 */
function validateState(state, next) {
	if (typeof (state === "object" && Object.keys(state).length !== 0)) {
		return state;
	} else {
		const err = { code: 10003 };
		next(err);
		return;
	}
}

const keyHandlers = {
	email: lowerString,
	pass: hashPass,
	lang: validateLang,
	moduleId: upperString,
	lessonId: upperString,
	taskId: upperString,
	questionId: upperString,
	state: validateState,
};

/***
 * Function check all incoming API params: required and optional.
 * It validates them and delet unnecessary params.
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} Prepared data on success; undefined on fail
 */
function prepareRequestData(req, res, next) {
	try {
		const { data = {}, path, query = {}, body = {}, headers } = req;
		const reqData = { ...query, ...body };
		const methodName = PATH.parse(path)?.name;
		const { requiredParams = [], otherParams = [] } =
			STUDENT.find((item) => item.name === methodName) || {};
		const allParams = [...requiredParams, ...otherParams];

		if (data?.wall && !headers?.accesstoken) {
			requiredParams.push("userId");
		}

		for (const param of requiredParams) {
			if (!(param in reqData)) {
				const err = { code: 10002 };
				next(err);
				return;
			}
		}

		for (const [key, value] of Object.entries(reqData)) {
			if (!allParams.includes(key)) {
				delete reqData[key];
			}

			if (key in keyHandlers) {
				reqData[key] = keyHandlers[key](value, next);
			}
		}

		req.data = Object.assign(data, reqData);
		next();
		return data;
	} catch (e) {
		const err = { code: 20101, trace: e };
		next(err);
		return;
	}
}

module.exports = prepareRequestData;
