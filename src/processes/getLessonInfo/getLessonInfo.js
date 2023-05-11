const { log } = require("@logger");

const DB = require("../../services/mongo/requests");
const { getModuleId, getLessonId } = require("@utils/idExtractor");

async function getLessonInfo(data, next) {
	const fullLessonId = data.lessonId;

	const moduleId = getModuleId(fullLessonId);
	const lessonId = getLessonId(fullLessonId);

	const query = { code: moduleId };

	const moduleData = await DB.getOne("modules", {
		query,
	});

	if (!moduleData) {
		log.info(`${moduleId}: Module didn't found!`);
		next({ code: 10301 });
		return false;
	}

	const lessonData = Object.entries(moduleData.lessons).find(
		([id]) => id === lessonId
	);

	if (!lessonData) {
		log.info(`${fullLessonId}: Lesson didn't found!`);
		next({ code: 10302 });
		return false;
	}

	data.lesson = lessonData[1];

	return true;
}

module.exports = getLessonInfo;
