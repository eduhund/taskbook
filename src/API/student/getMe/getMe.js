const { getUserInfo } = require("@processes");

/***
 * getMe StudentAPI method.
 * https://api.eduhund.com/docs/student#getMe
 *
 * @since 0.6.0
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} User data on success; undefined on fail
 */
async function getMe(req, res, next) {
	try {
		const { data } = req;

		const userExists = await getUserInfo(data, next);
		if (!userExists) return;

		const content = data.user;
		delete content.pass;

		next({ code: 0, content });
		return content;
	} catch (e) {
		const err = { code: 20204, trace: e };
		next(err);
		return;
	}
}

module.exports = getMe;
