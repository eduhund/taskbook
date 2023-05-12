const { getLessonInfo, getStateInfo, prepareData } = require("@processes");

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

		isAuth && (await getStateInfo(data));

		const content = await prepareData("lesson", data, isAuth, next);

		next({ code: 0, content });
		return content;
	} catch (e) {
		const err = { code: 20206, trace: e };
		next(err);
		return;
	}
}

module.exports = getLesson;
