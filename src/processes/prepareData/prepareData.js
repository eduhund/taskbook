const getTaskInfo = require("../getTaskInfo/getTaskInfo");
const {
	calculateUserScore,
	calculateModuleMaxScore,
	calculateDoneTasks,
} = require("../../utils/calculators");
const { getNextTaskId } = require("../../utils/getNextTaskId");
const setLessonsState = require("@utils/setLessonsState");
const { getLessonId } = require("@utils/idExtractor");
const { getParentContent } = require("../../utils/getParentContent");
const { setVisibility } = require("../../utils/visibilityControl");
const { refAnswerRight } = require("../../utils/refAnswerRight");
const setState = require("../setState/setState");

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

async function prepareLessonData(data, next) {
	const fullLessonId = data.lessonId;
	const lessonId = getLessonId(fullLessonId);
	const { lesson, state } = data;

	const content = {
		id: lessonId,
		title: lesson.title,
		description: lesson.description,
	};

	const { intro, final, maxScore } = lesson;

	const tasksPromises = lesson.tasks.map(async (taskId) => {
		const taskInfo = await getTaskInfo(
			{
				taskId,
				returns: ["id", "name", "type"],
			},
			next
		);
		if (taskInfo.type === "practice") {
			const taskState = state.find((item) => item.taskId === taskId);
			taskInfo.score = taskState?.score || 0;
			taskInfo.isChecked = taskState?.isChecked || false;
			taskInfo.inProcess = taskState?.inProcess || false;
		}
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

function validateTaskState(taskState) {
	var {
		isChecked,
		score,
		inProcess,
		protest,
		isHintActive,
		isOurVarActive,
		isSolutionActive,
		comments,
	} = taskState;

	isChecked = isChecked || false;
	score = score >= 0 ? score : null;
	inProcess = inProcess || false;
	protest = protest || false;
	isHintActive = isHintActive || false;
	isOurVarActive = isOurVarActive || false;
	isSolutionActive = isSolutionActive || false;
	comments = comments || [];

	return {
		isChecked,
		score,
		inProcess,
		protest,
		isHintActive,
		isOurVarActive,
		isSolutionActive,
		comments,
	};
}

async function prepareTaskData(data, next) {
	const { userId, taskId, task, state } = data;
	const taskState = validateTaskState(state);
	for (const content of task.content) {
		for (const introItem of content.intro) {
			if (introItem.type == "richText") {
				for (const richItem of introItem.value) {
					if (richItem.parentId) {
						const value = await getParentContent(
							userId,
							richItem.parentId,
							lang
						);

						richItem.value = value[0];

						if (!value[1]) {
							introItem.value = value[0];
							introItem.type = "p";
							break;
						}
					}
				}
			}

			if (introItem.parentId) {
				const value = await getParentContent(userId, introItem.parentId, lang);
				introItem.value = value[0];
			}
		}
		for (const question of content.questions || []) {
			if (question?.subtopic) {
				for (let i = 0; i < question?.subtopic.length; i++) {
					if (question?.subtopic[i].parentId) {
						const value = await getParentContent(
							userId,
							question?.subtopic[i].parentId,
							lang
						);
						question.subtopic[i] = value[0];
					}
				}
			}

			if (taskState?.data?.[question.id]?.isVisible != undefined) {
				question.isVisible = taskState?.data?.[question.id]?.isVisible;
			} else if (
				question.depends &&
				taskState?.data?.[question.id]?.isVisible == undefined
			) {
				for (const depend of question.depends) {
					if (depend.type == "visibility") {
						const isVisible = await setVisibility(
							userId,
							depend.parentId,
							question.id
						);
						question.isVisible = isVisible;
						if (!isVisible) {
							break;
						}
					}
				}
			} else {
				const path = "data." + question.id + ".isVisible";
				await setState({
					userId,
					taskId,
					newState: {
						[path]: true,
					},
				});
				question.isVisible = true;
			}
			const questionId = question.id;
			if (question.type === "text" || question.type === "link") {
				question.answer = taskState?.data?.[questionId]?.state || "";
			} else {
				for (const variant of question.variants) {
					if (variant.parentId) {
						const value = await getParentContent(
							userId,
							variant.parentId,
							lang
						);
						variant.label = value[0];
					}
					if (variant.refs) {
						variant.isRight = await refAnswerRight(userId, variant.refs);
					}
					variant.isSelected =
						(taskState?.data?.[questionId]?.state || []).find(
							(item) => item?.id === variant.id
						)?.isSelected || false;
				}
			}
		}
	}
	return task;
}

function prepareData(type, data, isAuth, next) {
	switch (type) {
		case "module":
			return prepareModuleData(data, isAuth, next);
		case "lesson":
			return prepareLessonData(data, next);
		case "task":
			return prepareTaskData(data, next);
	}
}

module.exports = prepareData;
