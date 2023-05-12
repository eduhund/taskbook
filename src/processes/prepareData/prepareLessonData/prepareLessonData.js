const { setTasksState } = require("../../setListState/setListState");
const {
	calculateUserScore,
	calculateDoneTasks,
} = require("@utils/calculators");
const { getLessonId } = require("@utils/idExtractor");

/***
 * Function prepares lesson data to send to user.
 *
 * @param {Object} data Throught API object
 *
 * @returns {Object} Lesson content
 */
async function prepareLessonData(data) {
	const fullLessonId = data.lessonId;
	const lessonId = getLessonId(fullLessonId);
	const { lesson, state, isAuth } = data;
	const { intro, final, maxScore } = lesson;

	const content = {
		id: lessonId,
		title: lesson.title,
		description: lesson.description,
	};

	if (!isAuth) {
		return content;
	}

	const tasks = await setTasksState(lesson.tasks, state);

	const scoped = { intro, final, tasks };

	const totalTasks = tasks.reduce((count, task) => {
		if (task.type === "practice") {
			return count + 1;
		}
		return count;
	}, 0);

	const progress = {
		score: calculateUserScore(state),
		maxScore,
		doneTasks: calculateDoneTasks(state),
		totalTasks,
	};

	return Object.assign(content, scoped, progress);
}

module.exports = prepareLessonData;
