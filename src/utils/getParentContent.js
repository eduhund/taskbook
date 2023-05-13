// Deprecated

const getPhrase = require("@assets/lang/lang");
const { getFullTaskId, getFullQuestionId } = require("./idExtractor");
const DB = require("@mongo/requests");

async function getTaskName(taskId, lang) {
	const taskData = await DB.getOne("task", { query: { id: taskId } });
	if (!taskData) {
		throw new Error(`getParentContent: Can't find task woth ID ${taskId}`);
	}
	const taskName = getPhrase(lang, "prevTaskFirst", taskData.name);
	return [taskName, false];
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

module.exports.getParentContent = getParentContent;
