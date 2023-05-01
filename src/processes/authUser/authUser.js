const { log } = require("@logger");

const database = require("../../services/mongo/requests");
const { accessTokens } = require("../../utils/tokenGenerator");
const { generateMessage } = require("../../utils/messageGenerator");

const tokens = accessTokens;

async function authUser(req, res) {
	try {
		const { lang, user } = req.data;

		const userToken = tokens.setToken(user);
		lang &&
			lang !== user.lang &&
			database("users", "setOne", {
				query: { email: user.email },
				set: { lang },
			});

		const userData = {
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			lang: lang || user.lang,
			token: userToken,
		};
		const data = generateMessage(0, userData);

		res.status(200).send(data);

		log.debug(`${user.id}: Auth success!`);
	} catch (e) {
		log.error(e);
		const err = { code: 20301 };
		next(err);
		return err;
	}
}

module.exports = authUser;
