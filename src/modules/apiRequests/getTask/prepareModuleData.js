const { getAroundTaskData } = require("../../../utils/getAroundTaskData");
const { getLessonId } = require("../../../utils/idExtractor");

async function prepareModuleData({ moduleData, taskId }) {
	const lesson = getLessonId(taskId);
	const moduleName = moduleData?.name;
	const moduleShortName = moduleData?.shortName;
	const totalTasks = moduleData?.totalTasks;
	const tasks = moduleData?.lessons[lesson]?.tasks;
	const currentTaskIndex = (tasks || []).indexOf(taskId);

	if (currentTaskIndex === -1) {
		return {
			moduleName,
			moduleShortName,
			totalTasks,
		};
	}
	const nextTaskId =
		currentTaskIndex < tasks.length ? tasks[currentTaskIndex + 1] : null;
	const prevTaskId = currentTaskIndex > 0 ? tasks[currentTaskIndex - 1] : null;

	const nextTask = await getAroundTaskData(nextTaskId);

	const prevTask = await getAroundTaskData(prevTaskId);

	return {
		moduleName,
		moduleShortName,
		totalTasks,
		nextTask,
		prevTask,
	};
}

module.exports.prepareModuleData = prepareModuleData;
