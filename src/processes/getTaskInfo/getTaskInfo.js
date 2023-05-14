const DB = require("@mongo/requests");

/***
 * Function provides task data.
 *
 * @param {Object} data Throught API object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} Task data on success; undefined on fail
 */
async function getTaskInfo(data, next) {
	const { taskId, returns } = data;
	const query = { id: taskId };

	const taskData = await DB.getOne("tasks", {
		query,
		returns,
	});

	if (!taskData) {
		next({ code: 10303 });
		return;
	}

	data.task = taskData;

	return taskData;
}

module.exports = getTaskInfo;
