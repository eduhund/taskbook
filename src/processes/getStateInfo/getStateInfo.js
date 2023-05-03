const { log } = require("@logger");

const database = require("../../services/mongo/requests");

async function getStateInfo(data) {
	const { userId, module } = data;
	const moduleId = module.code;
	const query = {
		userId,
		taskId: { $regex: `^${moduleId}` },
	};

	const stateData = await database("state", "getMany", {
		query,
	});

	data.state = stateData;

	return true;
}

module.exports = getStateInfo;
