const { log } = require("@logger");

const database = require("../../services/mongo/requests");

async function getStateInfo(data) {
	const { userId, moduleId, lessonId, taskId } = data;
	const id = moduleId || lessonId || taskId;
	const query = {
		userId,
		taskId: { $regex: `^${id}` },
	};

	const stateData = await database("state", taskId ? "getOne" : "getMany", {
		query,
	});

	data.state = stateData;

	return true;
}

module.exports = getStateInfo;
