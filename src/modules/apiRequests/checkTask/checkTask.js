const { log } = require("@logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");

const {
	calculateScore,
	calculateDefaultScore,
} = require("../../../utils/calculators");
const { generateMessage } = require("../../../utils/messageGenerator");
const { addUserAction } = require("../../../modules/statistics/addUserAction");

async function checkTask({ req, res }) {
	const userId = req?.userId;
	const { taskId, isChecked, protest } = req.body;

	const requests = [
		getDBRequest("getTaskInfo", {
			query: { id: taskId },
		}),
		getDBRequest("getStateInfo", {
			query: { userId, taskId },
		}),
	];

	let score = 0;
	try {
		const [taskData, stateData] = await Promise.all(requests);

		if (isChecked) {
			if (protest) {
				score = taskData?.maxScore;
			} else if (!stateData?.data) {
				score = calculateDefaultScore(taskData?.content);
			} else {
				score = calculateScore(stateData?.data, taskData);
			}
		}

		const query = { userId, taskId };
		getDBRequest("setState", {
			query,
			state: { score, isChecked, protest },
			returns: ["score"],
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
