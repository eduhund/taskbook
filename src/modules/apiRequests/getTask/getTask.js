//require("dotenv").config();

const { log } = require("../../../utils/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { getModuleId, getLessonId } = require("../../../utils/idExtractor");
const { prepareModuleData } = require("./prepareModuleData");
const { prepareTaskData } = require("./prepareTaskData");

async function getTask({ userId, taskId }) {
	const moduleId = getModuleId(taskId);
	const lesson = getLessonId(taskId);

	log.debug(taskId);

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

	const preparedModuleData = await prepareModuleData(
		moduleData,
		taskId,
		lesson
	);

	const finalData = await prepareTaskData(
		[taskData, taskState, preparedModuleData],
		userId
	);

	finalData.deadline = userData?.modules[moduleId]?.deadline;

	finalData.totalTasks = moduleData?.totalTasks;

	return finalData;
}

module.exports.getTask = getTask;
