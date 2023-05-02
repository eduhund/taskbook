const { log } = require("@logger");

const database = require("../../services/mongo/requests");

async function updatePass(data, next) {
	const { email, pass } = data;
	const user = await database("users", "setOne", {
		query: { email },
		set: { pass },
	});

	if (!user) {
		log.debug(`${email}: User didn't found when was updating pass!`);
		throw new Error();
	}

	data.user = user;

	return true;
}

module.exports = updatePass;
