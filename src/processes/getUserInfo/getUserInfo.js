const { log } = require("@logger");

const DB = require("../../services/mongo/requests");

async function getUserInfo(data, next) {
	const { email, userId } = data;
	const query = { email, id: userId };
	Object.keys(query).forEach((key) => !query[key] && delete query[key]);

	const user = await DB.getOne("users", {
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

module.exports = getUserInfo;
