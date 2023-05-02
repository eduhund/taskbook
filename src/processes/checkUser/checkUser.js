const { log } = require("@logger");

const database = require("../../services/mongo/requests");

async function checkUser(data, next) {
	const { email } = data;
	const user = await database("users", "getOne", {
		query: { email },
	});

	if (!user) {
		log.info(`${email}: User didn't found!`);
		next({ code: 10101 });
		return false;
	}

	data.user = user;

	return true;
}

module.exports = checkUser;
