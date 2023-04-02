const { log } = require("../../../utils/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { checkKey } = require("../../../utils/otkRequests");
const { generateMessage } = require("../../../utils/messageGenerator");

async function createPassword({ req, res, next }) {
	const { email, pass, verifyKey } = req.body;

	const verifyResult = await checkKey(verifyKey);
	if (!verifyResult) {
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
