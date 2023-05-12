const getTaskInfo = require("../../getTaskInfo/getTaskInfo");
const { setLessonsState } = require("../../setListState/setListState");
const {
	calculateUserScore,
	calculateModuleMaxScore,
	calculateDoneTasks,
} = require("@utils/calculators");
const { getNextTaskId } = require("@utils/getNextTaskId");

/***
 * Function prepares module data to send to user.
 *
 * @param {Object} data Throught API object
 *
 * @returns {Object} Module content
 */
async function prepareModuleData(data) {
	const { module, state, isAuth } = data;
	const { intro, final } = module;

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

	if (!isAuth) {
		return content;
	}

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

	return Object.assign(content, scoped, progress);
}

module.exports = prepareModuleData;
