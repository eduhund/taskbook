const { log } = require("@logger");

const database = require("../../services/mongo/requests");

async function setState(data) {
	const { taskId, userId, newState } = data;
	const update = await database("state", "setOne", {
		query: { taskId, userId },
		set: newState,
	});

	if (!update) {
		log.debug(`${taskId}: A problem with !`);
		throw new Error();
	}

	return true;
}

module.exports = setState;
