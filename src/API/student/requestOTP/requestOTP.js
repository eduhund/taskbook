const {
	getUserInfo,
	getOTP
} = require("@processes");

/***
 * requestOTK StudentAPI method.
 * https://api.eduhund.com/docs/student#requestOTK
 *
 * @since 0.8.0
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} User data on success; undefined on fail
 */
async function requestOTP(req, res, next) {
	try {
		const { data } = req;

		const userExists = await getUserInfo(data, next);
		if (!userExists) return;

		const content = await getOTP(data.user.id, "oneTimePass");

		next({ code: 0, content });
		return content;
	} catch (e) {
		const err = { code: 20214, trace: e };
		next(err);
		return;
	}
}

module.exports = requestOTP;