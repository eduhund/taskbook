const { log } = require("../../../services/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { checkKey } = require("../../../utils/otkRequests");
const { generateMessage } = require("../../../utils/messageGenerator");

async function createPassword({ req, res, next }) {
	const { email, pass, key } = req.body;

	const verify = await checkKey(key);
	if (!verify) {
		const error = generateMessage(10105);
		res.status(401).send(error);
		return error;
	}

	const user = await getDBRequest("setUserInfo", {
		email,
		data: { pass },
	});

	if (!user) {
		const error = generateMessage(20101);
		res.status(401).send(error);
		return error;
	}

	next();
}

module.exports = { createPassword };
