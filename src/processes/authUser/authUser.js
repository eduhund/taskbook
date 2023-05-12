const { log } = require("@logger");

const DB = require("../../services/mongo/requests");
const { setToken } = require("../../services/tokenMachine/tokenMachine");

async function authUser(data, next) {
	try {
		const { lang, user } = data;

		const userToken = setToken(user);
		lang &&
			lang !== user.lang &&
			DB.setOne("users", {
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

		log.debug(`${user.id}: Auth success!`);

		return userData;
	} catch (e) {
		log.error(e);
		const err = { code: 20301 };
		next(err);
	}
}

module.exports = authUser;
