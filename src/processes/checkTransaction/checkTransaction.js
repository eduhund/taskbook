const DB = require("../../services/mongo/requests");

/***
 * Function checks user transaction.
 *
 * @param {Object} data Throught API object
 * @param {Function} next Express middleware next function
 *
 * @returns {boolean} Check result
 */
async function checkTransaction(data, next) {
	const { paymentId } = data;

	const payment = await DB.getOne("payments", {
		query: { paymentId },
	});

	if (!payment) {
		next({ code: 10106 });
		return false;
	}

	data.email = payment.email;

	return true;
}

module.exports = checkTransaction;
