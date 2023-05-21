const getTaskInfo = require("../../getTaskInfo/getTaskInfo");
const { setLessonsState } = require("../../setListState/setListState");
const {
	calculateUserScore,
	calculateModuleMaxScore,
	calculateDoneTasks,
	calculateDeadline,
} = require("@utils/calculators");
const { getNextTaskId } = require("@utils/getNextTaskId");

function checkMuduleStatus({ start, deadline, modules, prevModule }) {
	const now = Date.now();
	const startTS = Date.parse(start);
	const deadlineTS = Date.parse(deadline);
	const caution = 1000 * 60 * 60 * 24 * 10;

	if (Object.keys(modules).includes(prevModule)) {
		return "unavailable";
	}

	if (startTS > now) {
		return "paid";
	}
	if (now > deadlineTS) {
		return "past";
	}
	if (now >= deadlineTS - caution && now < deadlineTS) {
		return "deadline";
	}
	if (now < deadlineTS) {
		return "active";
	}

	return "available";
}

/***
 * Function prepares module data to send to user.
 *
 * @param {Object} data Throught API object
 *
 * @returns {Object} Module content
 */
async function prepareModuleData(data, next) {
	const { user, module, state, isAuth, isFinalAccess } = data;
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
		prevModule: module.prevModule,
	};

	if (!isFinalAccess || !isAuth || !user.modules[module.code]) {
		return content;
	}

	const prolongation = {
		prolongation: module.prolongation,
		prolongationLink: module.prolongationLink,
	};

	const nextTaskId = getNextTaskId(module, state);

	const lessons = setLessonsState(module.lessons, nextTaskId);

	const scoped = { intro, final, lessons };

	const { start, deadline, prolongations } = user.modules[module.code];

	const lastDeadline = calculateDeadline({ deadline, prolongations });

	const status = checkMuduleStatus({
		start,
		deadline: lastDeadline,
		modules: user.modules,
		prevModule: module.prevModule,
	});

	const progress = {
		score: calculateUserScore(state),
		maxScore: calculateModuleMaxScore(module.lessons),
		doneTasks: calculateDoneTasks(state),
		totalTasks: module.totalTasks,
		start,
		deadline: lastDeadline,
		status,
		nextTask: await getTaskInfo(
			{
				taskId: nextTaskId,
				returns: ["id", "name", "type"],
			},
			next
		),
	};

	return Object.assign(content, scoped, prolongation, progress);
}

module.exports = prepareModuleData;
