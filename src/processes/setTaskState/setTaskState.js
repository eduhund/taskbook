const { log } = require("@logger");

const database = require("../../services/mongo/requests");

async function setTaskState(data) {
	const { taskId, userId, newState } = data;
	const update = await database("state", "setOne", {
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
