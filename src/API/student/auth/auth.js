const {
	getUserInfo,
	checkCredentials,
	authUser,
	prepareData,
} = require("@processes");

/***
 * auth StudentAPI method.
 * https://api.eduhund.com/docs/student#auth
 *
 * @since 0.6.0
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} User data on success; undefined on fail
 */
async function auth(req, res, next) {
	try {
		const { data } = req;

		const userExists = await getUserInfo(data, next);
		if (!userExists) return;

		const credentialsValid = checkCredentials(data, next);
		if (!credentialsValid) return;

		await authUser(data);

		const content = prepareData.userData(data);

		next({ code: 0, content });
		return content;
	} catch (e) {
		const err = { code: 20201, trace: e };
		next(err);
		return;
	}
}

module.exports = auth;
