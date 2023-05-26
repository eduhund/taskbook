const { log } = require("../../../services/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { checkKey } = require("../../../utils/otkRequests");
const { generateMessage } = require("../../../utils/messageGenerator");

async function createPassword({ req, res, next }) {
	const { email, pass, key, lang } = req.body;

	const verify = await checkKey(key);
	if (!verify) {
		const error = generateMessage(10105);
		res.status(401).send(error);
		return error;
	}

	const data = { pass };

	if (lang) {
		data.lang = lang;
	}

	const user = await getDBRequest("setUserInfo", {
		email,
		data,
	});

	if (!user) {
		const error = generateMessage(20101);
		res.status(401).send(error);
		return error;
	}

	next();
}

module.exports = { createPassword };
