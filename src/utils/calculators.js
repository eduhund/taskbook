const { getTaskProcessor } = require("./taskProcessor");
const { log } = require("../services/logger");

function validateScore(score, maxScore) {
	if (!score) {
		return 0;
	} else return score < maxScore ? score : maxScore;
}

/**
 * Calculating current user score
 * @param {*} state
 * @param {*} task
 * @returns {*} current score
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
				getTaskProcessor(question).getScore(questionState, question.multiply)
			);
		},
		0
	);
	return validateScore(sum, task?.maxScore);
}

/**
 * Calculating total user's score for whole module
 * @param {*} state
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
 * Calculating maximum score for the task
 * @param {*} task
 * @returns task's maximum score
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
 * Calculating maximum score for the task
 * @param {*} task
 * @returns task's maximum score
 */
function calculateModuleMaxScore(lessons = {}) {
	let maxScore = 0;
	for (const lesson of Object.values(lessons)) {
		maxScore += lesson.maxScore || 0;
	}

	return maxScore;
}

/**
 * Calculate initial task score
 * @param {*} content
 * @returns {*} Initial task score
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

function calculateDeadline(date, duration, prolongations = []) {
	const dateStart = new Date(date);
	const dateFinish = new Date(
		dateStart.setDate(dateStart.getDate() + duration)
	);
	return dateFinish.toISOString().split("T")[0];
}

module.exports = {
	calculateScore,
	calculateMaxScore,
	calculateModuleMaxScore,
	calculateDefaultScore,
	calculateTotalScore,
	calculateDeadline,
};
