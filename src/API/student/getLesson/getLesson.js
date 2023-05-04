const {
	getLessonInfo,
	getStateInfo,
	prepareData,
} = require("../../../processes/processes");
const { checkAuth } = require("../../../services/express/security");

async function getLesson(req, res, next) {
	try {
		const isAuth = checkAuth(req, res, next);
		if (!isAuth) return;

		const { data } = req;

		const lessonData = await getLessonInfo(data, next);
		if (!lessonData) return;

		isAuth && (await getStateInfo(data));

		const content = await prepareData("lesson", data, isAuth, next);

		next({ code: 0, content });
	} catch (e) {
		const err = { code: 20206, trace: e };
		next(err);
	}
}

module.exports = getLesson;
