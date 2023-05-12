const getTaskInfo = require("../../getTaskInfo/getTaskInfo");
const {
	calculateUserScore,
	calculateDoneTasks,
} = require("@utils/calculators");
const { getLessonId } = require("@utils/idExtractor");

async function prepareLessonData(data) {
	const fullLessonId = data.lessonId;
	const lessonId = getLessonId(fullLessonId);
	const { lesson, state } = data;

	const content = {
		id: lessonId,
		title: lesson.title,
		description: lesson.description,
	};

	const { intro, final, maxScore } = lesson;

	const tasksPromises = lesson.tasks.map(async (taskId) => {
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

	const tasks = await Promise.all(tasksPromises);

	const scoped = { intro, final, tasks };

	const totalTasks = tasks.filter((task) => task.type === "practice").length;

	const progress = {
		score: calculateUserScore(state),
		maxScore,
		doneTasks: calculateDoneTasks(state),
		totalTasks,
	};
	Object.assign(content, scoped, progress);
	return content;
}

module.exports = prepareLessonData;
