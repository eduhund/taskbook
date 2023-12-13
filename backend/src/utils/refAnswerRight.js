// Deprecated

const { STATE } = require("../modules/dbRequests/mongo");
const { getFullTaskId, getFullQuestionId } = require("./idExtractor");

/**
 * Switch variant right status
 * @param {string} userId
 * @param {array} refs
 * @returns {boolean} variant result status
 */
async function refAnswerRight(userId = "", refs = []) {
	let resultValue;
	for (const ref of refs) {
		for (const id of ref.variantIds) {
			const taskId = getFullTaskId(id);
			const questionId = getFullQuestionId(id);

			const status = await STATE.findOne({
				userId,
				taskId,
			}).then((result) => {
				const answer = (result?.data?.[questionId]?.state || []).find(
					(answer) => answer.id == id
				);
				if (
					(answer?.isSelected && ref.type == "isRight") ||
					(!answer?.isSelected && ref.type == "isWrong")
				)
					return true;
				else return false;
			});
			resultValue = status;
			if (!status) break;
		}
		return resultValue;
	}
}

module.exports.refAnswerRight = refAnswerRight;
