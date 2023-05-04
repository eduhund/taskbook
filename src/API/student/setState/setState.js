const {
	getTaskInfo,
	getStateInfo,
	setTaskState,
} = require("../../../processes/processes");
const { checkAuth } = require("../../../services/express/security");

async function setState(req, res, next) {
	try {
		const isAuth = checkAuth(req, res, next);
		if (!isAuth) return;

		const { data } = req;

		for (const [key, value] of Object.entries(data.newState)) {
			if (/[A-Za-z]{3}\d{8}/.test(key)) {
				const path = "data." + key + ".state";
				data.newState[path] = value;
				delete data.newState[key];
			}
		}

		const taskData = await getTaskInfo(data, next);
		if (!taskData) return;

		const taskState = await getStateInfo(data);
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
	} catch (e) {
		const err = { code: 20207, trace: e };
		next(err);
	}
}

module.exports = setState;
