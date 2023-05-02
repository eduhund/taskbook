const { log } = require("@logger");

const database = require("../../services/mongo/requests");

async function getUser(data, next) {
	const { email, userId } = data;
	const query = { email, id: userId };
	Object.keys(query).forEach((key) => !query[key] && delete query[key]);

	const user = await database("users", "getOne", {
		query,
	});

	if (!user) {
		log.info(`${email}: User didn't found!`);
		next({ code: 10101 });
		return false;
	}

	data.user = user;

	return true;
}

module.exports = getUser;
