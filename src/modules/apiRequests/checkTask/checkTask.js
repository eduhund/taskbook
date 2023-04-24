const { log } = require("../../../services/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");

const {
	calculateScore,
	calculateDefaultScore,
} = require("../../../utils/calculators");
const { generateMessage } = require("../../../utils/messageGenerator");
const { addUserAction } = require("../../../modules/statistics/addUserAction");
const { getModuleId } = require("../../../utils/idExtractor");

async function checkTask({ req, res }) {
	const userId = req?.userId;
	const { taskId, isChecked, protest } = req.body;
	const moduleId = getModuleId(taskId);

	const requests = [
		getDBRequest("getTaskInfo", {
			query: { id: taskId },
		}),
		getDBRequest("getStateInfo", {
			query: { userId, taskId },
		}),
		getDBRequest("getUserInfo", {
			query: { id: userId },
		}),
	];

	let score = 0;
	try {
		const [taskData, stateData, userData] = await Promise.all(requests);

		let userScore = userData.modules[moduleId].score || 0;

		if (isChecked) {
			if (protest) {
				score = taskData?.maxScore;
			} else if (!stateData?.data) {
				score = calculateDefaultScore(taskData?.content);
			} else {
				score = calculateScore(stateData?.data, taskData);
			}
			userScore += score;
		} else {
			userScore -= stateData?.score;
		}

		const query = { userId, taskId };
		getDBRequest("setState", {
			query,
			state: { score, isChecked, protest },
		});

		const scorePath = `modules.${moduleId}.score`;

		getDBRequest("setUserInfo", {
			query: { id: userId },
			data: { [scorePath]: score },
		});
		const data = generateMessage(0, { score });

		res.status(200).send(data);

		return data;
	} catch (e) {
		log.warn(`${taskId}: Error while task was checking`);
		log.warn(e);
		const error = generateMessage(20105);
		res.status(400).send(error);
	} finally {
		addUserAction({
			userId,
			action: "checkTask",
			data: { taskId, isChecked, protest, score },
			req,
		});
	}
}

module.exports.checkTask = checkTask;
