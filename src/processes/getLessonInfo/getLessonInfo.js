const DB = require("@mongo/requests");
const { getModuleId, getLessonId } = require("@utils/idExtractor");

/***
 * Function provides data for module's specific lesson.
 *
 * @param {Object} data Throught API object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} Lesson's data on success; undefined on fail
 */
async function getLessonInfo(data, next) {
	const fullLessonId = data.lessonId;

	const moduleId = getModuleId(fullLessonId);
	const lessonId = getLessonId(fullLessonId);

	const query = { code: moduleId };

	const moduleData = await DB.getOne("modules", { query });

	if (!moduleData) {
		next({ code: 10301 });
		return;
	}

	const lessonData = moduleData.lessons[lessonId];

	if (!lessonData) {
		next({ code: 10302 });
		return;
	}

	data.lesson = lessonData;

	return lessonData;
}

module.exports = getLessonInfo;
