const getTaskInfo = require("../getTaskInfo/getTaskInfo");
const {
	calculateUserScore,
	calculateModuleMaxScore,
	calculateDoneTasks,
} = require("../../utils/calculators");
const { getNextTaskId } = require("../../utils/getNextTaskId");
const setLessonsState = require("@utils/setLessonsState");
const { getLessonId } = require("@utils/idExtractor");

async function prepareModuleData(data, isAuth, next) {
	const { module, state } = data;

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
		nextTask: await getTaskInfo(
			{
				taskId: nextTaskId,
				returns: ["id", "name", "type"],
			},
			next
		),
	};
	Object.assign(content, scoped, progress);
	return content;
}

async function prepareLessonData(data, isAuth, next) {
	const fullLessonId = data.lessonId;
	const lessonId = getLessonId(fullLessonId);
	const { lesson, state } = data;

	const content = {
		id: lessonId,
		title: lesson.title,
		description: lesson.description,
	};

	if (!isAuth) return content;

	const { intro, final, maxScore } = lesson;

	const tasksPromises = lesson.tasks.map(async (taskId) => {
		const taskInfo = await getTaskInfo(
			{
				taskId,
				returns: ["name", "type"],
			},
			next
		);
		return taskInfo;
	});

	const tasks = await Promise.all(tasksPromises);

	const scoped = { intro, final, tasks };

	const totalTasks = tasks.filter((task) => task.type === "practice").length;

	const progress = {
		score: calculateUserScore(state),
		maxScore,
		doneTasks: calculateDoneTasks(state),
		totalTasks,
	};
	Object.assign(content, scoped, progress);
	return content;
}

function prepareData(type, data, isAuth, next) {
	switch (type) {
		case "module":
			return prepareModuleData(data, isAuth, next);
		case "lesson":
			return prepareLessonData(data, isAuth, next);
	}
}

module.exports = prepareData;
