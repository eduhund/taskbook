const { log } = require("@logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { getFullTaskId } = require("../../../utils/idExtractor");
const { getVisibilityUpdateList } = require("./getVisibilityUpdateList");
const { updateDependenciesTasks } = require("./updateDependenciesTasks");
const { generateMessage } = require("../../../utils/messageGenerator");
const { addUserAction } = require("../../../modules/statistics/addUserAction");
const { getParentContent } = require("../../../utils/getParentContent");
const { refAnswerRight } = require("../../../utils/refAnswerRight");

async function updateContent(taskData, taskState = {}, userId, lang = "en") {
	const questionsDict = {};
	for (const content of taskData.content) {
		for (const question of content.questions || []) {
			const questionId = question.id;
			if (question.type !== "text" && question.type !== "link") {
				for (variant of question.variants) {
					if (variant.parentId) {
						const value = await getParentContent(
							userId,
							variant.parentId,
							lang,
							variant.parentId.startsWith(taskData.id)
						);
						variant.label = value[0];
					}
					if (variant.refs) {
						variant.isRight = await refAnswerRight(userId, variant.refs);
					}
					variant.isSelected =
						(taskState[questionId]?.state || []).find(
							(item) => item?.id === variant.id
						)?.isSelected || false;
				}
				questionsDict[questionId] = { state: question.variants };
			}
		}
	}
	return questionsDict;
}

async function setState({ req, res }) {
	const userId = req?.userId;
	const { questionId, state } = req.body;

	const taskId = getFullTaskId(questionId);

	const taskData = await getDBRequest("getTaskInfo", {
		query: { id: taskId },
	});

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

		const updatedData = await updateContent(
			taskData,
			newState?.value?.data,
			userId
		);

		const finalData = Object.assign(
			{},
			newState?.value?.data || {},
			updatedData
		);

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
