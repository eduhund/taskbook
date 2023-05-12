const { log } = require("@logger");
const { getUserInfo, checkCredentials, authUser } = require("@processes");

/***
 * auth StudentAPI method.
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

		const credentialsValid = await checkCredentials(data, next);
		if (!credentialsValid) return;

		const content = await authUser(data);

		next({ code: 0, content });
		return content;
	} catch (e) {
		log.debug(e);
		const err = { code: 20201 };
		next(err);
		return;
	}
}

module.exports = auth;
