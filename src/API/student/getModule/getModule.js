const {
	checkFinalAccess,
	getUserInfo,
	getModuleInfo,
	getStateInfo,
	prepareModuleData,
} = require("@processes");

/***
 * getModule StudentAPI method.
 * https://api.eduhund.com/docs/student#getModule
 *
 * @since 0.6.0
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} Module data on success; undefined on fail
 */
async function getModule(req, res, next) {
	try {
		const { data } = req;

		console.log(data);

		const moduleData = await getModuleInfo(data, next);
		if (!moduleData) return;

		if (data.isAuth) {
			await getUserInfo(data, next);
		}

		const isUserAccess = checkFinalAccess(data, next);

		if (isUserAccess) {
			await getStateInfo(data, next);
		}

		const content = await prepareModuleData(data, next);

		next({ code: 0, content });
		return content;
	} catch (e) {
		const err = { code: 20205, trace: e };
		next(err);
		return;
	}
}

module.exports = getModule;
