const { log } = require("../../../services/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");

async function updateDependenciesTasks(userId, questions, state) {
	// Modify each question in the list
	const requestOptions = {
		upsert: true,
		returnDocument: "after",
		returnNewDocument: true,
	};
	try {
		if (questions.length) {
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
						const variant = (state || []).find(
							(item) => item.id == targetVariant
						);
						data = {
							[path]: variant?.isSelected ? true : false,
						};
						break;
				}
				await getDBRequest("setState", {
					query,
					state: data,
					returns: [],
				});
			}
		}
	} catch (e) {
		log.warn("Error with updating task visibility:", e);
	}
	return;
}

module.exports.updateDependenciesTasks = updateDependenciesTasks;
