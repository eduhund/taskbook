const { log } = require("../../../services/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { generateMessage } = require("../../../utils/messageGenerator");
const { addUserAction } = require("../../../modules/statistics/addUserAction");

async function getModuleInfo({ req, res }) {
	const userId = req?.userId;
	const moduleId = req?.query?.moduleId;

	const requests = [
		getDBRequest("getUserInfo", {
			query: { id: userId },
			returns: ["modules"],
		}),
		getDBRequest("getUserState", {
			query: {
				userId,
				taskId: { $regex: `^${moduleId}` },
			},
		}),
		getDBRequest("getModuleInfo", {
			query: { code: moduleId },
			returns: [
				"name",
				"shortName",
				"lessons",
				"totalTasks",
				"moduleLink",
				"lang",
			],
		}),
	];

	try {
		const [userData, stateData, moduleData] = await Promise.all(requests);

		moduleData.deadline = userData?.modules?.[moduleId]?.deadline;
		moduleData.startDate = userData?.modules?.[moduleId]?.start;

		let maxScore = 0;
		for (const lesson of Object.values(moduleData?.lessons)) {
			for (const task of lesson.tasks) {
				const taskData = await getDBRequest("getTaskInfo", {
					query: {
						id: task,
						type: "practice",
					},
					returns: ["maxScore"],
				});
				maxScore += taskData?.maxScore || 0;
			}
		}

		moduleData.maxScore = maxScore;

		delete moduleData.lessons;

		moduleData.score = stateData.reduce(
			(progress, value) => progress + (value?.score || 0),
			0
		);

		moduleData.doneTasks = stateData.reduce((progress, value) => {
			if (value.isChecked) {
				return progress + 1;
			} else return progress;
		}, 0);

		const data = generateMessage(0, moduleData);

		res.status(200).send(data);

		return data;
	} catch (e) {
		log.warn(`${moduleId}: Error with processing module Info`);
		log.warn(e);
		const error = generateMessage(20110);
		res.status(400).send(error);
	} finally {
		addUserAction({
			userId,
			action: "getModuleInfo",
			data: { userId },
			req,
		});
	}
}

module.exports.getModuleInfo = getModuleInfo;
