const { log } = require("@logger");

const database = require("../../services/mongo/requests");

async function getCounselorInfo(data, next) {
	const { lang } = data;
	const query = { lang };

	const counselor = await database("counselor", "getOne", {
		query,
	});

	if (!counselor) {
		log.debug(`Can't find counselor data for language ${lang}!`);
		throw new Error();
	}

	data.counselor = counselor;

	return counselor;
}

module.exports = getCounselorInfo;
