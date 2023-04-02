const { log } = require("../../../utils/logger");

const { getParentContent } = require("../../../utils/getParentContent");
const { setVisibility } = require("../../../utils/visibilityControl");
const { refAnswerRight } = require("../../../utils/refAnswerRight");
const { getDBRequest } = require("../../dbRequests/dbRequests");

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

async function prepareTaskData({ taskData, taskState, userId }) {
	try {
		if (taskData.type === "practice") {
			Object.assign(taskData, validateTaskState(taskState));
			for (const content of taskData.content) {
				for (const introItem of content.intro) {
					if (introItem.type == "richText") {
						for (const richItem of introItem.value) {
							if (richItem.parentId) {
								const value = await getParentContent(userId, richItem.parentId);

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
						const value = await getParentContent(userId, introItem.parentId);
						introItem.value = value[0];
					}
				}
				for (question of content.questions || []) {
					if (question?.subtopic) {
						for (let i = 0; i < question?.subtopic.length; i++) {
							if (question?.subtopic[i].parentId) {
								const value = await getParentContent(
									userId,
									question?.subtopic[i].parentId
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
						const taskId = taskData.id;
						try {
							await getDBRequest("setState", {
								query: { userId, taskId },
								state: {
									[path]: true,
								},
							});
							question.isVisible = true;
						} catch (e) {
							log.warn(e);
						}
					}
					const questionId = question.id;
					if (question.type === "text" || question.type === "link") {
						question.answer = taskState?.data?.[questionId]?.state || "";
					} else {
						for (variant of question.variants) {
							if (variant.parentId) {
								const value = await getParentContent(userId, variant.parentId);
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
		}
		return taskData;
	} catch (e) {
		log.warn("Error with preparing task data!");
		throw e;
	}
}

module.exports.prepareTaskData = prepareTaskData;
