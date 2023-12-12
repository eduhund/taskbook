const { log } = require("@logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { getModuleId } = require("../../../utils/idExtractor");
const { prepareModuleData } = require("./prepareModuleData");
const { prepareTaskData } = require("./prepareTaskData");
const { generateMessage } = require("../../../utils/messageGenerator");

async function getTask(req, res) {
	const userId = req.userId;
	const { taskId } = req.query;

	const moduleId = getModuleId(taskId);

	const requests = [
		getDBRequest("getUserInfo", {
			query: { id: userId },
			returns: ["modules"],
		}),
		getDBRequest("getModuleInfo", {
			query: { code: moduleId },
		}),
		getDBRequest("getTaskInfo", {
			query: { id: taskId },
		}),
		getDBRequest("getStateInfo", {
			query: { userId, taskId },
		}),
	];

	const [userData, moduleData, taskData, taskState] = await Promise.all(
		requests
	);

	if (!moduleData) {
		const error = generateMessage(10303);
		res.status(200).send(error);
		return;
	}

	if (!taskData) {
		const error = generateMessage(10301);
		res.status(200).send(error);
		return;
	}

	const preparedModuleData = await prepareModuleData({ moduleData, taskId });

	const preparedTaskData = await prepareTaskData({
		taskData,
		taskState,
		userId,
		lang: moduleData?.lang,
	});

	const preparedUserData = {
		deadline: userData?.modules[moduleId]?.deadline,
	};

	const aggData = {
		...preparedModuleData,
		...preparedTaskData,
		...preparedUserData,
	};

	const data = generateMessage(0, aggData);
	res.status(200).send(data);

	return;
}

module.exports = getTask;
