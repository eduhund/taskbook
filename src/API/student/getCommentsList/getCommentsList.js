const {
	checkModuleAccess,
	getUserInfo,
	getTaskInfo,
	getStateInfo,
	prapareTaskData,
} = require("@processes");

/***
 * getCommentsList StudentAPI method.
 * https://api.eduhund.com/docs/student#getCommentsList
 *
 * Canary
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} Task data on success; undefined on fail
 */
async function getCommentsList(req, res, next) {
	try {
		const { data } = req;

		await getUserInfo(data, next);

		if (!checkModuleAccess(data)) {
			next({ code: 10201 });
			return;
		}

		const state = await getStateInfo(data, next);
		console.log(data.user);
		const content = { comments: state.comments || [] };

		next({ code: 0, content });
		return content;
	} catch (e) {
		const err = { code: 20212, trace: e };
		next(err);
		return;
	}
}

module.exports = getCommentsList;
