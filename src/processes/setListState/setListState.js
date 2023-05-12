const getTaskInfo = require("../getTaskInfo/getTaskInfo");
const { getLessonId } = require("@utils/idExtractor");

/***
 * Function prepares lessons list with current state.
 *
 * @param {Object} data Throught API object
 *
 * @returns {Array} List of lessons
 */
function setLessonsState(lessons = {}, nextTaskId) {
	const lessonsState = Object.entries(lessons).map(([id, value]) => {
		return {
			id,
			title: value.title,
			description: value.description,
			status: "future",
		};
	});

	const currentLessonId = getLessonId(nextTaskId);

	const currentLessonIndex = Object.keys(lessons).indexOf(currentLessonId);

	lessonsState.forEach((lesson, index) => {
		if (index < currentLessonIndex) {
			lesson.status = "past";
		} else if (index === currentLessonIndex) {
			lesson.status = "current";
		}
	});

	return lessonsState;
}

/***
 * Function prepares lessons list with current state.
 *
 * @param {Object} data Throught API object
 *
 * @returns {Array} List of lessons
 */
async function setTasksState(tasks = [], state = []) {
	const tasksPromises = tasks.map(async (taskId) => {
		const taskInfo = await getTaskInfo({
			taskId,
			returns: ["id", "name", "type"],
		});
		if (taskInfo.type === "practice") {
			const taskState = state.find((item) => item.taskId === taskId);
			taskInfo.score = taskState?.score || 0;
			taskInfo.isChecked = taskState?.isChecked || false;
			taskInfo.inProcess = taskState?.inProcess || false;
		}
		return taskInfo;
	});

	return Promise.all(tasksPromises);
}

module.exports = { setLessonsState, setTasksState };
