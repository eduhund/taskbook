const DB = require("@mongo/requests");

/***
 * Function added new comment to the task.
 *
 * @param {Object} data Throught API object
 *
 * @returns {Array} Array of task's comments with the new one
 */
async function pushComment(data) {
	const { taskId, userId, comment } = data;

	const newComment = {
		ts: Date.now(),
		message: comment,
		readedByTeacher: false,
	};

	const update = await DB.setOne("state", {
		query: { taskId, userId },
		push: {
			comments: {
				$each: [newComment],
				$position: 0,
			},
		},
		returns: ["comments"],
	});

	if (!update) {
		throw new Error(`${taskId}: A problem pushing new comment to DB!`);
	}

	return update;
}

module.exports = pushComment;
