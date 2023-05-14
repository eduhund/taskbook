const {
	checkModuleAccess,
	getUserInfo,
	getTaskInfo,
	getStateInfo,
	prapareTaskData,
} = require("@processes");

/***
 * getTask StudentAPI method.
 * https://api.eduhund.com/docs/student#getTask
 *
 * @since 0.6.0
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} Task data on success; undefined on fail
 */
async function getTask(req, res, next) {
	try {
		const { data } = req;

		const taskData = await getTaskInfo(data, next);
		if (!taskData) return;

		await getUserInfo(data);

		if (!checkModuleAccess(data)) {
			next({ code: 10201 });
			return;
		}

		let content = taskData;
		if (taskData.type === "practice") {
			await getStateInfo(data);
			content = await prapareTaskData(data);
		}

		next({ code: 0, content });
		return content;
	} catch (e) {
		const err = { code: 20207, trace: e };
		next(err);
		return;
	}
}

module.exports = getTask;
