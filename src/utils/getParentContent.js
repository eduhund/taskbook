// Deprecated

const getPhrase = require("@assets/lang/lang");
const { getFullTaskId, getFullQuestionId } = require("./idExtractor");
const { getDBRequest } = require("../modules/dbRequests/dbRequests");

async function getTaskName(taskId, lang) {
	const taskData = await DB.getOne("tasks", { query: { id: taskId } });
	if (!taskData) {
		throw new Error(`getParentContent: Can't find task with ID ${taskId}`);
	}
	const taskName = getPhrase(lang, "prevTaskFirst", {
		taskName: taskData.name,
	});
	return [taskName, false];
}

async function getParentContent(userId, contentId, lang, sameTask = false) {
	const taskId = getFullTaskId(contentId);
	const taskState = await getDBRequest("getStateInfo", {
		query: { userId, taskId },
	})

	if (taskState?.isChecked || sameTask) {
		const questionId = getFullQuestionId(contentId);
		const parentContent = taskState.data?.[questionId]?.state;
		if (parentContent?.value) {
			return [parentContent?.value, true];
		} else if (Array.isArray(parentContent)) {
			const selectedAnswers = parentContent
				.filter((item) => item.isSelected)
				.map((item) => item.label);
			return [selectedAnswers.join(", ") || "", true];
		}
	}

	return getTaskName(taskId, lang);
}

module.exports.getParentContent = getParentContent;
