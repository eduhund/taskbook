const { log } = require("../../../services/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { accessTokens } = require("../../userTokens/accessTokens");
const { generateMessage } = require("../../../utils/messageGenerator");

const tokens = accessTokens;

async function checkPayment({ req, res }) {
	const { paymentId } = req.body;

	const payment = await getDBRequest("getPaymentInfo", {
		query: { paymentId },
	});

	if (!payment) {
		log.info(`${paymentId}: Payment didn't found!`);
		const error = generateMessage(10106);
		res.status(401).send(error);
		return error;
	}

	const user = await getDBRequest("getUserInfo", {
		query: { email: payment.email },
	});

	if (!user) {
		log.info(`${payment.email}: User didn't found!`);
		const error = generateMessage(10101);
		res.status(401).send(error);
		return error;
	}

	const userToken = tokens.setToken(user);
	log.info(`${user.id}: Auth success!`);
	const userData = {
		id: user.id,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		lang: user.lang,
		token: userToken,
	};
	const data = generateMessage(0, userData);

	res.status(200).send(data);

	return data;
}

module.exports = { checkPayment };
