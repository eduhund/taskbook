const { log } = require("@logger");

const database = require("../../services/mongo/requests");
const { checkPass } = require("../../utils/pass");
const { generateMessage } = require("../../utils/messageGenerator");

async function checkCredentials(req, res, next) {
	try {
		const { email, pass } = req.data;

		const user = await database("users", "getOne", {
			query: { email },
			returns: ["id", "email", "firstName", "lastName", "lang"],
		});

		if (!user) {
			log.info(`${email}: User didn't found!`);
			const error = generateMessage(10101);
			res.status(401).send(error);
			return error;
		}

		if (!checkPass(user, pass)) {
			log.info(`${email}: Invalid password!`);
			const error = generateMessage(10102);
			res.status(401).send(error);
			return error;
		}

		req.data.user = user;

		next();
	} catch (e) {
		log.error(e);
		const err = { code: 20201 };
		next(err);
		return err;
	}
}

module.exports = checkCredentials;
