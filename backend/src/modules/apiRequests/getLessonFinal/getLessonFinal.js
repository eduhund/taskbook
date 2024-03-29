const { log } = require("@logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");

const { getModuleId, getLessonId } = require("../../../utils/idExtractor");
const { createSummary } = require("./createSummary");
const { generateMessage } = require("../../../utils/messageGenerator");

async function getLessonFinal(req, res) {
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
			returns: ["shortName", "lessons", "lang"],
		}),
	];

	const [userData, stateData, moduleData] = await Promise.all(requests);

	const lessonsArray = Object.keys(moduleData.lessons || {});
	const currentLessonIndex = lessonsArray.indexOf(lessonId);

	moduleData.lessonNumber = Number(lessonId);
	moduleData.nextLesson = lessonsArray.length > currentLessonIndex + 1;
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
	moduleData.totalTasks = totalPractice;

	moduleData.deadline = userData?.modules?.[moduleId].deadline;

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

	return;
}

module.exports = getLessonFinal;
