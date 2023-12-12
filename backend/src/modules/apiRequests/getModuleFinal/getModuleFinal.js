const { log } = require("@logger");
const {
	calculateModuleMaxScore,
} = require("../../../utils/calculators");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { generateMessage } = require("../../../utils/messageGenerator");

async function getModuleFinal(req, res) {
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
				"final",
				"totalTasks",
				"mascot",
				"lang",
			],
		}),
	];

	const [userData, stateData, moduleData] = await Promise.all(requests);

	if (!moduleData) {
		const error = generateMessage(10303);
		res.status(200).send(error);
		return error;
	}

	moduleData.deadline = userData?.modules?.[moduleId].deadline;

	moduleData.maxScore = calculateModuleMaxScore(moduleData.lessons);

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

	return;
}

module.exports = getModuleFinal;
