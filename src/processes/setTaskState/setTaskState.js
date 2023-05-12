const DB = require("@mongo/requests");

/***
 * Function set new task state.
 *
 * @param {Object} data Throught API object
 *
 * @returns {Object} New task state
 */
async function setTaskState(data) {
	const { taskId, userId, newState } = data;
	const update = await DB.setOne("state", {
		query: { taskId, userId },
		set: newState,
		options: {
			insertNew: true,
		},
	});

	if (!update) {
		throw new Error(`${taskId}: A problem with setting new task state!`);
	}

	return update;
}

module.exports = setTaskState;
