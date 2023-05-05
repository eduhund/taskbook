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
const setTaskState = require("../setTaskState/setTaskState");
const setDiploma = require("../setDiploma/setDiploma");
const {
	generateSkills,
} = require("../../API/student/getDiploma/generateSkills");
const { generateCertId } = require("../../utils/generateCertId");
const { createCert } = require("../../utils/certGenerator");
const provideData = require("../../API/student/getDiploma/provideData");
const CyrillicToTranslit = require("cyrillic-to-translit-js");

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

async function prepareTaskData(data) {
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
				await setTaskState({
					userId,
					taskId,
					state: {
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

async function prepareDiplomaData(data) {
	const cyrillicToTranslit = new CyrillicToTranslit();
	const {
		userId,
		moduleId,
		params: { lang, isColor, isMascot, isProgress, isPublic } = {},
		user,
		module,
		state,
	} = data;

	const params = {
		lang: lang || undefined,
		isColor: isColor ? isColor === "true" : undefined,
		isMascot: isMascot ? isMascot === "true" : undefined,
		isProgress: isProgress ? isProgress === "true" : undefined,
		isPublic: isPublic ? isPublic === "true" : undefined,
	};

	for (const key of Object.keys(params)) {
		if (params[key] === undefined) delete params[key];
	}

	const start = user?.modules?.[moduleId]?.deadline;
	const deadline = user?.modules?.[moduleId]?.deadline;
	const now = new Date(Date.now()).toISOString().split("T")[0];
	const certDate = Date.parse(deadline) < Date.parse(now) ? deadline : now;

	const certId =
		user?.modules?.[moduleId]?.certId ||
		(await generateCertId(userId, moduleId, start));

	const certData = await setDiploma({
		query: { id: certId },
		params,
		returns: ["lang", "isColor", "isMascot", "isProgress", "isPublic"],
	});

	Object.assign(params, certData?.value || {});

	if (params.lang === undefined) params.lang = module.lang;
	if (params.isColor === undefined) params.isColor = false;
	if (params.isMascot === undefined) params.isMascot = true;
	if (params.isProgress === undefined) params.isProgress = true;
	if (params.isPublic === undefined) params.isPublic = false;

	const firstName =
		params.lang === "ru"
			? user.firstName
			: cyrillicToTranslit.transform(user.firstName);
	const lastName =
		params.lang === "ru"
			? user.lastName
			: cyrillicToTranslit.transform(user.lastName);

	const score = state.reduce(
		(progress, value) => progress + (value?.score || 0),
		0
	);

	const maxScore = Object.values(module?.lessons).reduce((sum, lesson) => {
		return (sum += lesson.maxScore || 0);
	}, 0);

	const doneTasks = state.reduce((progress, value) => {
		if (value.isChecked) {
			return ++progress;
		} else return progress;
	}, 0);

	const progress = Math.trunc((score / maxScore) * 100);

	const skills = await generateSkills(
		moduleId,
		userId,
		params.lang || module.lang
	);

	const info = {
		moduleId,
		moduleName: module?.name,
		firstName,
		lastName,
		certId,
		certDate,
		progress,
		skills,
	};

	const fullInfo = provideData(info, params);

	const fileId = await createCert(fullInfo);

	return {
		moduleId,
		moduleName: module.name,
		userId,
		firstName,
		lastName,
		start,
		deadline,
		certDate,
		certId,
		score,
		maxScore,
		skills,
		fileId,
		doneTasks,
		...params,
	};
}

function prepareData(type, data, isAuth, next) {
	switch (type) {
		case "module":
			return prepareModuleData(data, isAuth, next);
		case "lesson":
			return prepareLessonData(data, next);
		case "task":
			return prepareTaskData(data, next);
		case "diploma":
			return prepareDiplomaData(data, next);
	}
}

module.exports = prepareData;
