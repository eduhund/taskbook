const { getFullTaskId, getFullQuestionId } = require("./idExtractor");
const { db } = require("../modules/dbRequests/mongo");

function selLang(lang, phrase) {
	if (lang === "ru") return `Сделайте вначале задачу ${phrase}`;
	else return `Solve the problem ${phrase} first`;
}

function getTaskName(taskId, lang) {
	return db.TASKS.findOne({ id: taskId }).then((result) => {
		return [selLang(lang, result?.name), false];
	});
}

function getParentContent(userId, contentId, lang) {
	const taskId = getFullTaskId(contentId);
	return db.STATE.findOne({
		userId,
		taskId,
	}).then((result) => {
		if (result?.isChecked) {
			try {
				const questionId = getFullQuestionId(contentId);
				const parentContent = result.data?.[questionId]?.state;
				if (parentContent?.value) {
					return [parentContent?.value, true];
				} else {
					const selectedAnswers = parentContent
						.filter((item) => item.isSelected)
						.map((item) => item.label);
					return [selectedAnswers.join(", ") || "", true];
				}
			} catch {
				return [undefined, false];
			}
		} else return getTaskName(taskId, lang);
	});
}

module.exports.getParentContent = getParentContent;
