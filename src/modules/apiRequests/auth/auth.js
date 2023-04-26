const { log } = require("@logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { accessTokens } = require("../../userTokens/accessTokens");
const { checkPass } = require("../../../utils/pass");
const { generateMessage } = require("../../../utils/messageGenerator");

const tokens = accessTokens;

async function auth({ req, res }) {
	const { email, pass, lang } = req.body;

	const user = await getDBRequest("getUserInfo", {
		query: { email },
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

	const userToken = tokens.setToken(user);
	lang &&
		lang !== user.lang &&
		getDBRequest("setUserInfo", { email, data: { lang } });
	log.info(`${user.id}: Auth success!`);
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

	return data;
}

module.exports.auth = auth;
