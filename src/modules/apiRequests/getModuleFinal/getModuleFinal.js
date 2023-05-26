const { log } = require("@logger");
const {
	calculateModuleMaxScore,
	calculateDeadline,
} = require("../../../utils/calculators");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { generateMessage } = require("../../../utils/messageGenerator");
const { addUserAction } = require("../../../modules/statistics/addUserAction");

async function getModuleFinal({ req, res }) {
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

	try {
		const [userData, stateData, moduleData] = await Promise.all(requests);

		if (!moduleData) {
			const error = generateMessage(10303);
			res.status(200).send(error);
			return error;
		}

		moduleData.deadline = calculateDeadline(userData?.modules?.[moduleId]);

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

		return data;
	} catch (e) {
		log.warn(`${moduleId}: Error with processing module final page`);
		log.warn(e);
		const error = generateMessage(20104);
		res.status(400).send(error);
	} finally {
		addUserAction({
			userId,
			action: "getModuleFinal",
			data: { moduleId },
			req,
		});
	}
}

module.exports.getModuleFinal = getModuleFinal;
