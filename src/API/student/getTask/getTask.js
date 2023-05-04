const {
	getTaskInfo,
	getStateInfo,
	prepareData,
} = require("../../../processes/processes");
const { checkAuth } = require("../../../services/express/security");

async function getTask(req, res, next) {
	try {
		const isAuth = checkAuth(req, res, next);
		if (!isAuth) return;

		const { data } = req;

		const taskData = await getTaskInfo(data, next);
		if (!taskData) return;

		if (taskData.type === "practice") {
			await getStateInfo(data);
			const content = await prepareData("task", data, isAuth, next);
			next({ code: 0, content });
		} else {
			next({ code: 0, content: taskData });
		}
	} catch (e) {
		const err = { code: 20206, trace: e };
		next(err);
	}
}

module.exports = getTask;
