const { db } = require("../modules/dbRequests/mongo");
const { log } = require("../services/logger");
const { accessTokens } = require("../modules/userTokens/accessTokens");
const { getModuleId } = require("./idExtractor");

function checkAuth(req, res, next) {
	const token = req?.query?.accessToken || req?.body?.accessToken;
	const userId = accessTokens.checkList()?.[token]?.id;

	if (!userId) {
		res.status(401);
		res.send({
			OK: false,
			error: {
				code: 10103,
				type: "invalid_credentials",
				description: "Invalid access token",
			},
		});
	} else {
		req.userId = userId;
		next();
	}
}

/**
 * Validate active user token
 * @param {Object} tokenList
 * @param {string} token
 * @returns {string | null}
 */
function checkToken(tokenList = {}, token = "") {
	return tokenList?.[token] || null;
}

function checkDate(start, deadline) {
	if (!start && !deadline) return undefined;
	const today = Date.now();
	return today >= Date.parse(start) && today < Date.parse(deadline)
		? true
		: false;
}

/**
 * Check student access to module data
 * @param {string} userId
 * @param {string} moduleId
 * @returns {boolean}
 */
function checkModuleAccess(req, res, next) {
	const userId = req.userId;

	const lessonId = req?.query?.lessonId || req?.body?.lessonId;
	const taskId = req?.query?.taskId || req?.body?.taskId;
	const questionId = req?.query?.questionId || req?.body?.questionId;
	const moduleId =
		req?.query?.moduleId ||
		req?.body?.moduleId ||
		getModuleId(lessonId || taskId || questionId);

	db.USERS.findOne({ id: userId }).then((user) => {
		startDate = user?.modules?.[moduleId]?.start;
		deadline = user?.modules?.[moduleId]?.deadline;
		if (checkDate(startDate, deadline)) {
			log.info("User", userId, "have access to module", moduleId);
			next();
		} else {
			log.info("User", userId, "doesn't have access to module", moduleId);
			res.status(403);
			res.send({
				OK: false,
				error: {
					code: 10201,
					type: "access_denied",
					description: "You don't have access to this content",
				},
			});
		}
	});
}

/**
 * Check student access to module module final and certificate
 * @param {string} userId
 * @param {string} moduleId
 * @returns {boolean}
 */
function checkCertAccess(req, res, next) {
	const userId = req.userId;

	const moduleId = req?.query?.moduleId || req?.body?.moduleId;

	db.USERS.findOne({ id: userId }).then((user) => {
		const modules = Object.keys(user?.modules);
		if (modules.includes(moduleId)) {
			log.info("User", userId, "have access to certificate", moduleId);
			next();
		} else {
			log.info("User", userId, "doesn't have access to certificate", moduleId);
			res.status(403);
			res.send({
				OK: false,
				error: {
					code: 10201,
					type: "access_denied",
					description: "You don't have access to this content",
				},
			});
		}
	});
}

module.exports.checkToken = checkToken;
module.exports.checkAuth = checkAuth;
module.exports.checkModuleAccess = checkModuleAccess;
module.exports.checkCertAccess = checkCertAccess;
