const { log } = require("@logger");

const { checkKey } = require("../../services/otk/requests");
const { generateMessage } = require("../../utils/messageGenerator");

async function checkOTK(req, res, next) {
	try {
		const { key } = req.data;

		const verify = await checkKey(key);
		if (!verify) {
			const error = generateMessage(10105);
			res.status(401).send(error);
			return error;
		}

		next();
	} catch (e) {
		log.error(e);
		const err = { code: 20203 };
		next(err);
		return err;
	}
}

module.exports = checkOTK;
