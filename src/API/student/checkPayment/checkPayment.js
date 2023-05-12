const { getUserInfo, checkTransaction, authUser } = require("@processes");

/***
 * checkPayment StudentAPI method.
 * https://api.eduhund.com/docs/student#checkPayment
 *
 * @since 0.6.0
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} User data on success; undefined on fail
 */
async function checkPayment(req, res, next) {
	try {
		const { data } = req;

		const transactionIsValid = await checkTransaction(data, next);
		if (!transactionIsValid) return;

		const userExists = await getUserInfo(data, next);
		if (!userExists) return;

		const content = await authUser(data);

		next({ code: 0, content });
		return content;
	} catch (e) {
		const err = { code: 20203, trace: e };
		next(err);
		return;
	}
}

module.exports = checkPayment;
