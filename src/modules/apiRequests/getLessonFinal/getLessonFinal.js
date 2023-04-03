const { log } = require("../../../utils/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");

const { getModuleId, getLessonId } = require("../../../utils/idExtractor");
const { createSummary } = require("./createSummary");

async function getLessonFinal({ req, res }) {
	const userId = req?.userId;
	const fullLessonId = req?.query?.lessonId;

	const moduleId = getModuleId(fullLessonId);
	const lessonId = getLessonId(fullLessonId);

	const requests = [
		getDBRequest("getUserInfo", {
			query: { id: userId },
			returns: ["modules"],
		}),
		getDBRequest("getUserState", {
			query: {
				userId,
				taskId: { $regex: `^${moduleId}${lessonId}` },
			},
		}),
		getDBRequest("getModuleInfo", {
			query: { code: moduleId },
			returns: ["shortName", "lessons", "maxScore", "totalTasks"],
		}),
	];

	try {
		const [userData, stateData, moduleData] = await Promise.all(requests);

		moduleData.lessonNumber = Number(lessonId);
		moduleData.maxScore = moduleData.lessons[lessonId]?.maxScore;
		moduleData.content = moduleData.lessons[lessonId]?.final;

		let totalPractice = 0;
		for (const task of moduleData.lessons[lessonId]?.tasks) {
			await getDBRequest("getTaskInfo", {
				query: { id: task },
				returns: ["type"],
			}).then((result) => {
				if (result?.type == "practice") totalPractice++;
			});
		}

		moduleData.deadline = userData?.modules?.[moduleId]?.deadline;

		moduleData.score = stateData.reduce(
			(progress, value) => progress + (value?.score || 0),
			0
		);

		moduleData.summary = createSummary(moduleData?.score, moduleData?.maxScore);

		moduleData.doneTasks = stateData.reduce((progress, value) => {
			if (value.isChecked) {
				return progress + 1;
			} else return progress;
		}, 0);

		delete moduleData.lessons;

		const data = generateMessage(0, moduleData);

		res.status(200).send(data);

		return data;
	} catch (e) {
		log.warn(`${moduleId}: Error with processing lesson final page`);
		log.warn(e);
		const error = generateMessage(20106);
		res.status(400).send(error);
	} finally {
		addUserAction({
			userId,
			action: "getLessonFinal",
			data: { moduleId },
			req,
		});
	}
}

module.exports.getLessonFinal = getLessonFinal;
