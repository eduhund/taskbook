const { db } = require("../modules/dbRequests/mongo");
const { getFullTaskId, getFullQuestionId } = require("./idExtractor");

function checkVisibility(id, taskState) {
	const questionId = getFullQuestionId(id);
	const questionData = taskState?.data?.[questionId] || {};
	const { isVisible = false, state = [] } = questionData;

	if (id.length === 13) {
		const answer = state.find((answer) => answer.id == id);
		return answer?.isSelected && isVisible;
	} else if (id.length === 11) {
		return questionData && isVisible;
	} else {
		throw new Error(`${questionId}: Question ID must be a 11 or 13 symbols!`);
	}
}

async function setVisibility(userId, dependQuestionId, currentElementId) {
	const dependTaskId = getFullTaskId(dependQuestionId);
	const currentTaskId = getFullTaskId(dependQuestionId);
	const path = "data." + currentElementId + ".isVisible";

	const taskState = await db.STATE.findOne({ userId, taskId: dependTaskId });

	const isVisible = checkVisibility(dependQuestionId, taskState);

	db.STATE.findOneAndUpdate(
		{ userId, taskId: currentTaskId },
		{
			$set: {
				[path]: isVisible,
			},
		},
		{
			upsert: true,
			returnDocument: "after",
			returnNewDocument: true,
			projection: { _id: 0 },
		}
	);
	return isVisible;
}

module.exports.setVisibility = setVisibility;
