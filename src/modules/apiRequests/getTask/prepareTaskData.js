const { log } = require("../../../utils/logger");

const { getParentContent } = require("../../../utils/getParentContent");
const { setVisibility } = require("../../../utils/visibilityControl");
const { refAnswerRight } = require("../../../utils/refAnswerRight");
const { getDBRequest } = require("../../dbRequests/dbRequests");

async function prepareTaskData([task, state, aroundTasks], userId) {
	task.inProcess = state?.inProcess || false;

	if (task.type === "practice") {
		task.isChecked = state?.is_checked || state?.isChecked || false;
		task.score = state?.score >= 0 ? state?.score : null;
		task.inProcess = state?.inProcess || false;
		task.protest = state?.protest || false;
		task.isHintActive = state?.isHintActive || false;
		task.isOurVarActive = state?.isOurVarActive || false;
		task.isSolutionActive = state?.isSolutionActive || false;
		task.comments = state?.comments || [];

		for (const content of task.content) {
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

				if (state?.data?.[question.id]?.isVisible != undefined) {
					question.isVisible = state?.data?.[question.id]?.isVisible;
				} else if (
					question.depends &&
					state?.data?.[question.id]?.isVisible == undefined
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
					const taskId = task.id;
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
					question.answer = state?.data?.[questionId]?.state || "";
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
							(state?.data?.[questionId]?.state || []).find(
								(item) => item?.id === variant.id
							)?.isSelected || false;
					}
				}
			}
		}
	}
	return Object.assign(task, aroundTasks);
}

module.exports.prepareTaskData = prepareTaskData;
