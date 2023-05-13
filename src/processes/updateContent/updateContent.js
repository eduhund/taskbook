const getPhrase = require("@assets/lang/lang");
const { getFullTaskId, getFullQuestionId } = require("@utils/idExtractor");
const DB = require("@mongo/requests");

async function getTaskName(taskId, lang) {
	const taskData = await DB.getOne("task", { query: { id: taskId } });
	if (!taskData) {
		throw new Error(`getParentContent: Can't find task woth ID ${taskId}`);
	}
	const taskName = getPhrase(lang, "prevTaskFirst", taskData.name);
	return [taskName, false];
}

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

async function setVisibility(userId, id, childId) {
	const idLength = id.length;
	const taskId = getFullTaskId(id);
	const questionId = getFullQuestionId(id);
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
				(answer) => answer.id == id
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
 * @param {string} userId
 * @param {array} refs
 * @returns {boolean} variant result status
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
