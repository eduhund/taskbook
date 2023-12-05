const { log } = require("@logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");

const {
	calculateScore,
	calculateDefaultScore,
} = require("../../../utils/calculators");
const { generateMessage } = require("../../../utils/messageGenerator");

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

	return;
}

module.exports = checkTask;
