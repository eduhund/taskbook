const { log } = require("@logger");

const database = require("../../services/mongo/requests");

async function getModuleInfo(data, next) {
	const { moduleId } = data;
	const query = { code: moduleId };

	const moduleData = await database("modules", "getOne", {
		query,
	});

	if (!moduleData) {
		log.info(`${moduleId}: Module didn't found!`);
		next({ code: 10301 });
		return false;
	}

	data.module = moduleData;

	return true;
}

module.exports = getModuleInfo;
