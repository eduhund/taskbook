const { log } = require("@logger");

const database = require("../../services/mongo/requests");

async function checkTransaction(data, next) {
	const { paymentId } = data;

	const payment = await database("payments", "getOne", {
		query: { paymentId },
	});

	if (!payment) {
		log.debug(`${paymentId}: Payment didn't found!`);
		next({ code: 10106 });
		return false;
	}

	data.email = payment.email;

	return true;
}

module.exports = checkTransaction;
