const { log } = require("../../../utils/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { accessTokens } = require("../../userTokens/accessTokens");
const { checkPass } = require("../../../utils/pass");

const tokens = accessTokens;

async function auth({ email, pass, lang }) {
	const user = await getDBRequest("getUserInfo", {
		query: { email },
	});
	if (user) {
		if (checkPass(user, pass)) {
			const userToken = tokens.setToken(user);
			lang !== user.lang &&
				getDBRequest("setUserInfo", { email, data: { lang } });
			log.info(`${user.id}: Auth success!`);
			return {
				OK: true,
				data: {
					id: user.id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					lang,
					token: userToken,
				},
			};
		} else {
			log.info(`${email}: Invalid password!`);
			return {
				OK: false,
				error: {
					code: 10102,
					type: "invalid_credentials",
					description: "Invalid password",
				},
			};
		}
	} else {
		log.info(`${email}: User didn't found!`);
		return {
			OK: false,
			error: {
				code: 10101,
				type: "invalid_credentials",
				description: "User didn't found",
			},
		};
	}
}

module.exports.auth = auth;
