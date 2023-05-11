const { log } = require("@logger");

const DB = require("../../services/mongo/requests");

async function checkTransaction(data, next) {
	const { paymentId } = data;

	const payment = await DB.getOne("payments", {
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
