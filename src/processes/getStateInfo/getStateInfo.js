const { log } = require("@logger");

const DB = require("../../services/mongo/requests");

async function getStateInfo(data) {
	const { userId, moduleId, lessonId, taskId } = data;
	const id = moduleId || lessonId || taskId;
	const query = {
		userId,
		taskId: { $regex: `^${id}` },
	};

	const stateData = taskId
		? await DB.getOne("state", { query })
		: await DB.getMany("state", { query });

	data.state = stateData;

	return true;
}

module.exports = getStateInfo;
