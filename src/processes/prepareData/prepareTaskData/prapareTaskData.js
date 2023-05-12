const { getParentContent } = require("@utils/getParentContent");
const { setVisibility } = require("@utils/visibilityControl");
const { refAnswerRight } = require("@utils/refAnswerRight");
const setTaskState = require("../../setTaskState/setTaskState");

function validateTaskState(taskState) {
	var {
		isChecked = false,
		score = null,
		inProcess = false,
		protest = false,
		isHintActive = false,
		isOurVarActive = false,
		isSolutionActive = false,
		comments = [],
	} = taskState || {};

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

module.exports = prepareTaskData;
