const { checkOTK, updatePass, authUser } = require("@processes");

/***
 * createPass StudentAPI method.
 * https://api.eduhund.com/docs/student#createPass
 *
 * @since 0.6.0
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} User data on success; undefined on fail
 */
async function createPass(req, res, next) {
	try {
		const { data } = req;

		const OTKIsValid = await checkOTK(data, next);
		if (!OTKIsValid) return;

		await updatePass(data, next);

		const content = await authUser(data);

		next({ code: 0, content });
		return content;
	} catch (e) {
		const err = { code: 20202, trace: e };
		next(err);
		return;
	}
}

module.exports = createPass;
