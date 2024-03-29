const { log } = require("@logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { generateMessage } = require("../../../utils/messageGenerator");

async function getLessonsList(req, res) {
	const userId = req?.userId;
	const moduleId = req?.query?.moduleId;

	const moduleData = await getDBRequest("getModuleInfo", {
		query: { code: moduleId },
		returns: ["lessons"],
	});

	const lessonList = [];

	for (const lesson of Object.entries(moduleData?.lessons || {})) {
		const [lessonId, lessonData] = lesson;
		const lessonStateData = await getDBRequest("getUserState", {
			query: {
				userId,
				taskId: { $regex: `^${moduleId}${lessonId}` },
			},
		});
		var inProcess = false;
		const progress =
			lessonStateData.length === 0
				? 0
				: Math.trunc(
						(lessonStateData.reduce((progress, value) => {
							if (value.inProcess && !inProcess) inProcess = true;
							return progress + (value.score || 0);
						}, 0) /
							lessonData?.maxScore) *
							100
					);

		lessonList.push({
			id: lessonId,
			title: lessonData.title,
			description: lessonData.description,
			maxScore: lessonData.maxScore,
			inProcess,
			progress,
		});
	}

	if (lessonList.length > 0) {
		let currentLesson = 0;
		lessonList.forEach((lesson, index) => {
			if (lesson.inProcess) {
				currentLesson = index;
			}
		});
		lessonList[currentLesson].currentLesson = true;
	}

	const data = generateMessage(0, lessonList);
	res.status(200).send(data);

	return;
}

module.exports = getLessonsList;
