const { log } = require("@logger");

const DB = require("../../services/mongo/requests");

async function getModuleInfo(data, next) {
	const { moduleId } = data;
	const query = { code: moduleId };

	const moduleData = await DB.getOne("modules", {
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
