const { log } = require("@logger");

const DB = require("../../services/mongo/requests");

async function getTaskInfo(data, next) {
	const { taskId, returns } = data;
	const query = { id: taskId };

	const taskData = await DB.getOne("tasks", {
		query,
		returns,
	});

	if (!taskData) {
		log.info(`${taskData}: Task didn't found!`);
		next({ code: 10203 });
		return false;
	}

	data.task = taskData;

	return taskData;
}

module.exports = getTaskInfo;
