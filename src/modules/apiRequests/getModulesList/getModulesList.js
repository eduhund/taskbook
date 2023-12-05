const { log } = require("../../../services/logger/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");

async function getModulesList({res}) {
	try {
		const modulesList = await getDBRequest("getModulesList", {});
		res.status(200).send({
			OK: true,
			data: modulesList,
		});

	} catch (e) {
		log.error("Error with processing get modules list");
		log.error(e);
		res.sendStatus(500);
	}

}

module.exports = getModulesList;
