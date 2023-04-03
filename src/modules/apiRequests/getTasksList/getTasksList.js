const { log } = require("../../../services/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { getModuleId, getLessonId } = require("../../../utils/idExtractor");
const { generateMessage } = require("../../../utils/messageGenerator");
const { addUserAction } = require("../../../modules/statistics/addUserAction");

async function getTasksList({ req, res }) {
	const userId = req?.userId;
	const fullLessonId = req?.query?.lessonId;

	const moduleId = getModuleId(fullLessonId);
	const lessonId = getLessonId(fullLessonId);

	const { lessons } = await getDBRequest("getModuleInfo", {
		query: { code: moduleId },
		returns: ["lessons"],
	});

	if (!lessons || !Object.keys(lessons)) {
		const error = generateMessage(10303);
		res.status(200).send(error);
		return error;
	}

	try {
		const tasksList = [];

		const lesson = lessons[lessonId];

		if (!lesson) {
			const error = generateMessage(10302);
			res.status(200).send(error);
			return error;
		}

		for (const taskId of lesson.tasks || []) {
			const taskData = await getDBRequest("getTaskInfo", {
				query: { id: taskId },
				returns: ["id", "type", "title", "name", "maxScore"],
			});

			if (!taskData) {
				const error = generateMessage(10301);
				res.status(200).send(error);
				return error;
			}

			switch (taskData?.type) {
				case "practice":
					taskData.label = taskData?.name;

					const taskState = await getDBRequest("getStateInfo", {
						query: { userId, taskId },
					});

					taskData.score = taskState?.score >= 0 ? taskState?.score : null;
					taskData.isChecked = taskState?.isChecked || false;
					taskData.inProcess = taskState?.inProcess;

					break;

				case "theory":
					taskData.label = "Теория";

					break;
			}

			tasksList.push(taskData);
		}

		const data = generateMessage(0, tasksList);

		res.status(200).send(data);

		return data;
	} catch (e) {
		log.warn(`${moduleId}: Error with processing tasks list`);
		log.warn(e);
		const error = generateMessage(20109);
		res.status(400).send(error);
	} finally {
		addUserAction({
			userId,
			action: "getTasksList",
			data: { userId },
			req,
		});
	}
}

module.exports.getTasksList = getTasksList;
