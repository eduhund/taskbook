const getPhrase = require("@assets/lang/lang");
const { getFullTaskId, getFullQuestionId } = require("@utils/idExtractor");
const DB = require("@mongo/requests");

/***
 * Modify string, if parent task isn't solved
 *
 * @param {String} taskId Task ID
 * @param {String} lang User lang
 *
 * @returns {Array} Modified string and strange bool
 */
async function getTaskName(taskId, lang) {
	const taskData = await DB.getOne("task", { query: { id: taskId } });
	if (!taskData) {
		throw new Error(`getParentContent: Can't find task woth ID ${taskId}`);
	}
	const taskName = getPhrase(lang, "prevTaskFirst", taskData.name);
	return [taskName, false];
}

/***
 * Serve all tasks, that will be updated
 *
 * @param {Array} tasks Tasks list
 * @param {String} questionId Reference question ID
 *
 * @returns {Array} Task list to modify
 */
function getVisibilityUpdateList(tasks, questionId) {
	const list = [];
	for (const task of tasks) {
		for (const contentItem of task?.content || []) {
			for (const question of contentItem?.questions || []) {
				for (const item of question?.depends || []) {
					if (
						item.type === "visibility" &&
						item.parentId.includes(questionId)
					) {
						switch (item.parentId.length) {
							case 13:
								list.push({
									type: "variant",
									targetTaskId: task.id,
									questionId: question.id,
									variantId: item.parentId,
								});
								break;
							case 11:
								list.push({
									type: "question",
									targetTaskId: task.id,
									questionId: question.id,
								});
								break;
						}
					}
				}
			}
		}
	}
	return list;
}

/***
 * Update question visibility
 *
 * @param {String} userId User ID
 * @param {String} contentId Question or Variant ID
 * @param {String} childId Question ID to modify
 *
 * @returns {Boolean} New question visibility
 */
async function setVisibility(userId, contentId, childId) {
	const idLength = id.length;
	const taskId = getFullTaskId(contentId);
	const questionId = getFullQuestionId(contentId);
	const path = "data." + childId + ".isVisible";
	const state = await DB.getOne("state", {
		query: {
			userId,
			taskId,
		},
	});

	let isVisible;
	switch (idLength) {
		case 13:
			const answer = (state?.data?.[questionId]?.state || []).find(
				(answer) => answer.id === contentId
			);
			if (answer?.isSelected && state?.data?.[questionId]?.isVisible)
				isVisible = true;
			else isVisible = false;
			break;
		case 11:
			if (state?.data?.[questionId] && state?.data?.[questionId]?.isVisible)
				isVisible = true;
			else isVisible = false;
			break;
	}
	await DB.setOne("state", {
		query: { userId, taskId },
		set: {
			[path]: isVisible,
		},
	});
	return isVisible;
}

/***
 * Replace question content to previous user's answers
 *
 * @param {String} userId User ID
 * @param {String} contentId Question or Variant ID
 * @param {String} lang User's lang
 *
 * @returns {String} New question content
 */
async function getParentContent(userId, contentId, lang) {
	const taskId = getFullTaskId(contentId);
	const taskState = await DB.getOne("state", {
		query: {
			userId,
			taskId,
		},
	});

	if (taskState?.isChecked) {
		const questionId = getFullQuestionId(contentId);
		const parentContent = taskState.data?.[questionId]?.state;
		if (parentContent?.value) {
			return [parentContent?.value, true];
		} else {
			const selectedAnswers = parentContent
				.filter((item) => item.isSelected)
				.map((item) => item.label);
			return [selectedAnswers.join(", ") || "", true];
		}
	} else return getTaskName(taskId, lang);
}

/**
 * Switch variant right status
 *
 * @param {String} userId User ID
 * @param {Array} refs List of references
 *
 * @returns {Boolean} Responsive variant status
 */
async function refAnswerRight(userId, refs = []) {
	for (const ref of refs) {
		for (const id of ref.variantIds) {
			const taskId = getFullTaskId(id);
			const questionId = getFullQuestionId(id);

			const state = await DB.getOne("state", {
				query: {
					userId,
					taskId,
				},
			});
			const answer = (state?.data?.[questionId]?.state || []).find(
				(answer) => answer.id == id
			);
			const isRight =
				(answer?.isSelected && ref.type == "isRight") ||
				(!answer?.isSelected && ref.type == "isWrong");

			if (!isRight) {
				return false;
			}
		}
		return true;
	}
}

/**
 * Update all task depends
 *
 * @param {String} userId User ID
 * @param {String} questionId Question ID
 * @param {Array} tasks List of tasks
 * @param {Object} refs Task's state object
 *
 * @returns {undefined}
 */
async function updateDependenciesTasks(userId, questionId, tasks, state) {
	const questions = getVisibilityUpdateList(tasks, questionId);
	if (questions.length === 0) {
		return;
	}
	for (const question of questions) {
		const targetTask = question.targetTaskId;
		const targetQuestion = question.questionId;
		const path = "data." + targetQuestion + ".isVisible";
		const query = { userId, taskId: targetTask };
		var data = {};
		switch (question.type) {
			case "question":
				data = {
					[path]: state?.data ? true : false,
				};
				break;
			case "variant":
				const targetVariant = question.variantId;
				const variant = (state || []).find((item) => item.id == targetVariant);
				data = {
					[path]: variant?.isSelected ? true : false,
				};
				break;
		}
		await DB.setOne("state", {
			query,
			state: data,
		});
	}
	return;
}

module.exports = {
	setVisibility,
	getParentContent,
	refAnswerRight,
	updateDependenciesTasks,
};
