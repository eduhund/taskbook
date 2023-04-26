const { log } = require("@logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { getModuleId, getLessonId } = require("../../../utils/idExtractor");
const { generateMessage } = require("../../../utils/messageGenerator");
const { addUserAction } = require("../../../modules/statistics/addUserAction");

async function getLessonStart({ req, res }) {
	const userId = req.userId;
	const fullLessonId = req.query.lessonId;

	const moduleId = getModuleId(fullLessonId);
	const lessonId = getLessonId(fullLessonId);

	const requests = [
		getDBRequest("getUserInfo", {
			query: { id: userId },
			returns: ["modules"],
		}),
		getDBRequest("getModuleInfo", {
			query: { code: moduleId },
			returns: ["name", "shortName", "lessons", "totalTasks", "lang"],
		}),
	];

	try {
		const [userData, moduleData] = await Promise.all(requests);

		moduleData.lessonNumber = Number(lessonId);
		moduleData.lessonName = moduleData.lessons[lessonId]?.title;
		moduleData.description = moduleData.lessons[lessonId]?.description;
		moduleData.intro = moduleData.lessons[lessonId]?.intro;
		moduleData.deadline = userData?.modules?.[moduleId]?.deadline;

		delete moduleData.lessons;

		const data = generateMessage(0, moduleData);

		res.status(200).send(data);

		return data;
	} catch (e) {
		log.warn(`${moduleId}: Error with processing lesson start page`);
		log.warn(e);
		const error = generateMessage(20105);
		res.status(400).send(error);
	} finally {
		addUserAction({
			userId,
			action: "getLessonStart",
			data: { moduleId },
			req,
		});
	}
}

module.exports.getLessonStart = getLessonStart;
