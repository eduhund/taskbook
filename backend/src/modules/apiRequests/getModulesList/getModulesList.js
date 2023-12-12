const { log } = require("../../../services/logger/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { generateMessage } = require("../../../utils/messageGenerator");

async function getModulesList(req, res) {
	const modulesList = await getDBRequest("getModulesList", {});

  const data = generateMessage(0, modulesList);
  res.status(200).send(data);

	return
}

module.exports = getModulesList;
