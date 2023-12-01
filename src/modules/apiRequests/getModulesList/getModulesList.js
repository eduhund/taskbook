const { log } = require("../../../services/logger/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");

async function getModulesList() {
	const modulesList = await getDBRequest("getModulesList", {});

	return modulesList;
}

module.exports.getModulesList = getModulesList;
