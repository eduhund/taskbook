const { log } = require("@logger");

const DB = require("../../services/mongo/requests");

async function updatePass(data, next) {
	const { email, pass } = data;
	const user = await DB.setOne("users", {
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
