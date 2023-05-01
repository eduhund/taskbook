const { log } = require("@logger");

const database = require("../../services/mongo/requests");
const { generateMessage } = require("../../utils/messageGenerator");

async function checkPayment(req, res, next) {
	try {
		const { paymentId } = req.data;

		const payment = await database("payments", "getOne", {
			query: { paymentId },
		});

		if (!payment) {
			log.debug(`${paymentId}: Payment didn't found!`);
			const error = generateMessage(10106);
			res.status(401).send(error);
			return error;
		}

		const user = await database("users", "getOne", {
			query: { email: payment.email },
			returns: ["id", "email", "firstName", "lastName", "lang"],
		});

		if (!user) {
			log.debug(`${payment.email}: User didn't found!`);
			const error = generateMessage(10101);
			res.status(401).send(error);
			return error;
		}

		req.data.user = user;

		next();
	} catch (e) {
		log.error(e);
		const err = { code: 20202 };
		next(err);
		return err;
	}
}

module.exports = checkPayment;
