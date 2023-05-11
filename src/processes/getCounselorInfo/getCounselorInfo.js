const { log } = require("@logger");

const DB = require("../../services/mongo/requests");

async function getCounselorInfo(data, next) {
	const { lang } = data;
	const query = { lang };

	const counselor = await DB.getOne("counselor", {
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
