const { log } = require("@logger");

const DB = require("../../services/mongo/requests");

async function setTaskState(data) {
	const { taskId, userId, newState } = data;
	const update = await DB.setOne("state", {
		query: { taskId, userId },
		set: newState,
	});

	if (!update) {
		log.debug(`${taskId}: A problem with setting new task state!`);
		throw new Error();
	}

	return update;
}

module.exports = setTaskState;
