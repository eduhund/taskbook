const {
	checkModuleAccess,
	getUserInfo,
	getLessonInfo,
	getStateInfo,
	prepareLessonData,
} = require("@processes");

/***
 * getLesson StudentAPI method.
 * https://api.eduhund.com/docs/student#getLesson
 *
 * @since 0.6.0
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} Lesson data on success; undefined on fail
 */
async function getLesson(req, res, next) {
	try {
		const { data } = req;

		const lessonData = await getLessonInfo(data, next);
		if (!lessonData) return;

		await getUserInfo(data);

		if (!checkModuleAccess(data)) {
			next({ code: 10201 });
			return;
		}

		await getStateInfo(data);

		const content = await prepareLessonData(data);

		next({ code: 0, content });
		return content;
	} catch (e) {
		const err = { code: 20206, trace: e };
		next(err);
		return;
	}
}

module.exports = getLesson;
