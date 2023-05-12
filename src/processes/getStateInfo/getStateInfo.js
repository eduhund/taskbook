const DB = require("../../services/mongo/requests");

/***
 * Function provides state data for requested item (full module | lesson | task).
 *
 * @param {Object} data Throught API object
 *
 * @returns {Array | Object} State data for task or array of state data objects
 */
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

	return stateData;
}

module.exports = getStateInfo;
