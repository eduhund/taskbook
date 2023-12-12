const { log } = require("@logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const accessTokens = require("../../../services/tokenMachine/tokenMachine");
const { generateMessage } = require("../../../utils/messageGenerator");

async function checkPayment(req, res) {
	const { paymentId } = req.body;

	const payment = await getDBRequest("getPaymentInfo", {
		query: { paymentId },
	});

	if (!payment) {
		log.warn(`${paymentId}: Payment didn't found!`);
		const error = generateMessage(10104);
		res.status(401).send(error);
		return;
	}

	const user = await getDBRequest("getUserInfo", {
		query: { email: payment.email },
		returns: ["id", "email", "firstName", "lastName", "lang"],
	});

	if (!user) {
		log.warn(`${payment.email}: User didn't found!`);
		const error = generateMessage(10101);
		res.status(401).send(error);
		return;
	}

	const userToken = accessTokens.setToken(user);

	const userData = {
		...user,
		token: userToken,
	};
	
	const data = generateMessage(0, userData);
	res.status(200).send(data);

	log.info(`${user.id}: Auth success!`);

	return;
}

module.exports = checkPayment;
