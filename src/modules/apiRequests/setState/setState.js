const { log } = require("@logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { getFullTaskId } = require("../../../utils/idExtractor");
const { getVisibilityUpdateList } = require("./getVisibilityUpdateList");
const { updateDependenciesTasks } = require("./updateDependenciesTasks");
const { generateMessage } = require("../../../utils/messageGenerator");
const { addUserAction } = require("../../../modules/statistics/addUserAction");

async function setState({ req, res }) {
	const userId = req?.userId;
	const { questionId, state } = req.body;

	const taskId = getFullTaskId(questionId);

	const tasks = await getDBRequest("getTasksList", {
		query: {
			"content.questions.depends.parentId": { $regex: questionId },
			"content.questions.depends.type": "visibility",
		},
		returns: ["id", "content"],
	});

	try {
		const questions = getVisibilityUpdateList(tasks, questionId);

		await updateDependenciesTasks(userId, questions, state);

		const path = "data." + questionId + ".state";
		const query = { userId, taskId };
		const update = {
			[path]: state,
			inProcess: true,
		};
		const newState = await getDBRequest("setState", {
			query,
			state: update,
			returns: [],
		});

		const finalData = newState?.value?.data || {};

		const data = generateMessage(0, finalData);

		res.status(200).send(data);

		return data;
	} catch (e) {
		log.warn(`${questionId}: Error while setting new question state`);
		log.warn(e);
		const error = generateMessage(20112);
		res.status(400).send(error);
	} finally {
		addUserAction({
			userId,
			action: "setState",
			data: { questionId },
			req,
		});
	}
}

module.exports.setState = setState;
