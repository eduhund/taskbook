const { log } = require("@logger");

const { checkPass } = require("../../utils/pass");
const { generateMessage } = require("../../utils/messageGenerator");

async function checkCredentials(req, res, next) {
	try {
		const { user, pass } = req.data;

		if (!checkPass(user, pass)) {
			log.info(`${user.email}: Invalid password!`);
			const error = generateMessage(10102);
			res.status(401).send(error);
			return error;
		}

		next();
	} catch (e) {
		log.error(e);
		const err = { code: 20202 };
		next(err);
		return err;
	}
}

module.exports = checkCredentials;
