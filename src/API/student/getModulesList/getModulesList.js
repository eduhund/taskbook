const {
	checkFinalAccess,
	getUserInfo,
	getModuleInfo,
	getStateInfo,
	prepareModuleData,
} = require("@processes");

/***
 * getModulesList StudentAPI method.
 * https://api.eduhund.com/docs/student#getModulesList
 *
 * @since 0.6.0
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} Module data on success; undefined on fail
 */
async function getModulesList(req, res, next) {
	try {
		const { data } = req;

		console.log(data);

		const modulesList = await getModuleInfo(data, next);

		if (data.isAuth) {
			await getUserInfo(data, next);
		}

		console.log(data);

		const content = [];

		for (const moduleData of modulesList) {
			data.module = moduleData;

			const isUserAccess = checkFinalAccess(data, next);

			console.log(isUserAccess);

			if (isUserAccess) {
				await getStateInfo(data, next);
			}

			content.push(await prepareModuleData(data, next));
		}

		next({ code: 0, content });
		return content;
	} catch (e) {
		const err = { code: 20213, trace: e };
		next(err);
		return;
	}
}

module.exports = getModulesList;
