const {
	checkModuleAccess,
	getUserInfo,
	getTaskInfo,
	getStateInfo,
	setTaskState,
	updateDependenciesTasks,
} = require("@processes");
const DB = require("@mongo/requests");

/***
 * setState StudentAPI method.
 * https://api.eduhund.com/docs/student#setState
 *
 * @since 0.6.0
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} New task's state on success; undefined on fail
 */
async function setState(req, res, next) {
	try {
		const { data } = req;

		await getUserInfo(data);

		if (!checkModuleAccess(data)) {
			next({ code: 10201 });
			return;
		}

		for (const [key, value] of Object.entries(data.newState)) {
			if (/[A-Za-z]{3}\d{8}/.test(key)) {
				const path = "data." + key + ".state";
				data.newState[path] = value;
				delete data.newState[key];

				const tasks = await DB.getMany("tasks", {
					query: {
						"content.questions.depends.parentId": { $regex: questionId },
						"content.questions.depends.type": "visibility",
					},
					returns: ["id", "content"],
				});

				await updateDependenciesTasks(data.userId, key, tasks, value);
			}
		}

		const taskData = await getTaskInfo(data, next);
		if (!taskData) return;

		const taskState = await getStateInfo(data, next);
		if (!taskState) {
			data.newState.inProcess = true;
		}

		if (data.newState.protest) {
			data.newState.score = taskData?.maxScore;
			data.newState.isChecked = true;
		} else {
			if (data.newState.isChecked) {
				data.newState.score = taskState?.data
					? calculateScore(stateData?.data, taskData)
					: calculateDefaultScore(taskData?.content);
			} else {
				data.newState.score = 0;
			}
		}

		const newState = await setTaskState(data, next);
		delete newState.comments;

		next({ code: 0, content: newState });
		return newState;
	} catch (e) {
		const err = { code: 20208, trace: e };
		next(err);
		return;
	}
}

module.exports = setState;
