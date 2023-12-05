const { log } = require("@logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { getNextTaskId } = require("../../../utils/getNextTaskId");
const { generateMessage } = require("../../../utils/messageGenerator");
const { addUserAction } = require("../../../modules/statistics/addUserAction");

async function getModuleStart({ req, res }) {
	const userId = req?.userId;
	const moduleId = req?.query?.moduleId;

	const requests = [
		getDBRequest("getUserInfo", {
			query: { id: userId },
			returns: ["modules"],
		}),
		getDBRequest("getUserState", {
			query: { userId: userId, taskId: { $regex: `^${moduleId}` } },
		}),
		getDBRequest("getModuleInfo", {
			query: { code: moduleId },
			returns: ["name", "shortName", "lessons", "mascot", "intro", "lang"],
		}),
	];

	const [userModules, userState, moduleData] = await Promise.all(requests);

	if (!moduleData) {
		const error = generateMessage(10303);
		res.status(200).send(error);
		return error;
	}

	moduleData.deadline = userModules?.modules?.[moduleId]?.deadline;

	moduleData.nextTaskId = getNextTaskId(moduleData, userState);

	moduleData.lessons = Object.entries(moduleData?.lessons).map(
		([id, data]) => {
			return { id, title: data?.title, description: data?.description };
		}
	);

	const data = generateMessage(0, moduleData);
	res.status(200).send(data);

	return;
}

module.exports = getModuleStart;
