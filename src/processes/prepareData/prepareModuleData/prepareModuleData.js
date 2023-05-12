const getTaskInfo = require("../../getTaskInfo/getTaskInfo");
const {
	calculateUserScore,
	calculateModuleMaxScore,
	calculateDoneTasks,
} = require("@utils/calculators");
const { getNextTaskId } = require("@utils/getNextTaskId");
const setLessonsState = require("@utils/setLessonsState");

async function prepareModuleData(data, next) {
	const { module, state, isAuth } = data;

	const content = {
		id: module.code,
		name: module.name,
		shortName: module.shortName,
		description: module.description,
		lang: module.lang,
		moduleLink: module.moduleLink,
		features: module.features,
		mascot: module.mascot,
		price: module.price,
		buyLink: module.buyLink,
	};

	if (!isAuth) return content;

	const { intro, final } = module;

	const nextTaskId = getNextTaskId(module, state);

	const lessons = setLessonsState(module.lessons, nextTaskId);

	const scoped = { intro, final, lessons };

	const progress = {
		score: calculateUserScore(state),
		maxScore: calculateModuleMaxScore(module.lessons),
		doneTasks: calculateDoneTasks(state),
		totalTasks: module.totalTasks,
		nextTask: await getTaskInfo({
			taskId: nextTaskId,
			returns: ["id", "name", "type"],
		}),
	};
	Object.assign(content, scoped, progress);
	return content;
}

module.exports = prepareModuleData;
