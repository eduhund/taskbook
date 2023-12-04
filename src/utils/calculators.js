const { getTaskProcessor } = require("./taskProcessor");

/**
 * Validate user's score
 *
 * @param {Number} score Task's score
 * @param {Number} maxScore Task's max score
 *
 * @returns {Number} Current score
 */
function validateScore(score, maxScore) {
	if (!score) {
		return 0;
	} else return score < maxScore ? score : maxScore;
}

/**
 * Calculate current user score
 *
 * @param {Object} state Task's score
 * @param {Object} task Task's data
 *
 * @returns {Number} Current score
 */
function calculateScore(state = {}, task = {}) {
	const questionsById = {};
	task?.content?.forEach((contentPart) => {
		contentPart.questions?.forEach((question) => {
			questionsById[question.id] = question;
		});
	});
	const sum = Object.entries(state ?? {}).reduce(
		(currentValue, [questionId, questionState]) => {
			const question = questionsById[questionId];
			return (
				currentValue +
				getTaskProcessor(question).getScore(questionState, question?.multiply)
			);
		},
		0
	);
	return validateScore(sum, task?.maxScore);
}

/**
 * Calculate amount user's score
 *
 * @param {Object} state Task's score
 *
 * @returns {Number} Current score
 */
function calculateUserScore(state = []) {
	return state.reduce((sum, item) => {
		return (sum += item.score || 0);
	}, 0);
}

/**
 * Calculate total user's score for whole module
 * Deprecatad
 *
 * @param {*} state
 *
 * @returns total score
 */
function calculateTotalScore(state = {}) {
	const totalScore = (state || []).reduce(
		(currentValue, content) => currentValue + (content.score || 0),
		0
	);
	return totalScore || 0;
}

/**
 * Calculate maximum score for the task
 * Deprecated
 *
 * @param {Object} task Task's data
 *
 * @returns {Number} Task's maximum score
 */
function calculateMaxScore(task = {}) {
	const maxScore = task?.content?.reduce(
		(currentValue, content) =>
			currentValue +
			content?.questions?.reduce(
				(currentValue, question) =>
					currentValue + getTaskProcessor(question).getMaxScore(),
				0
			),
		0
	);

	return maxScore;
}

/**
 * Calculate maximum score for the whole module
 *
 * @param {Object} lessons Lesson's object
 *
 * @returns {Number} Modules's maximum score
 */
function calculateModuleMaxScore(lessons = {}) {
	let maxScore = 0;
	for (const lesson of Object.values(lessons)) {
		maxScore += lesson.maxScore || 0;
	}

	return maxScore;
}

/**
 * Calculate initial task's score
 *
 * @param {Array} content Task's content list
 *
 * @returns {Number} Initial task's score
 */
function calculateDefaultScore(content = []) {
	const defaultScore = content?.reduce(
		(currentValue, content) =>
			currentValue +
			content?.questions?.reduce((currentValue, question) => {
				let sum = 0;
				if (question.type != "text" && question.type != "link") {
					sum = question?.variants?.reduce((currentValue, variant) => {
						if (!variant.isRight) {
							return currentValue + variant?.price || 0;
						} else {
							return currentValue;
						}
					}, 0);
				}
				return currentValue + sum;
			}, 0),
		0
	);
	return defaultScore;
}

/**
 * Calculate deadline for user's module
 *
 * @param {String} date Date of start
 * @param {Number} duration Days number of access
 *
 * @returns {String} Date of deadline
 */
function calculateDeadline(date, duration) {
	const dateStart = new Date(date);
	const dateFinish = new Date(
		dateStart.setDate(dateStart.getDate() + duration)
	);
	return dateFinish.toISOString().split("T")[0];
}

/**
 * Calculate number of the solved tasks
 *
 * @param {String} state State list
 *
 * @returns {Number} Number of the solved tasks
 */
function calculateDoneTasks(state = []) {
	return state.reduce((sum, item) => {
		return item.isChecked ? ++sum : sum;
	}, 0);
}

module.exports = {
	calculateScore,
	calculateUserScore,
	calculateMaxScore,
	calculateModuleMaxScore,
	calculateDefaultScore,
	calculateTotalScore,
	calculateDeadline,
	calculateDoneTasks,
};
