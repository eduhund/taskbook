const { getAroundTaskData } = require("../../../utils/getAroundTaskData");

async function prepareModuleData(data, taskId, lesson) {
  const moduleName = data?.name;
  const moduleShortName = data?.shortName;
  const tasks = data?.lessons[lesson]?.tasks;
  const currentTaskIndex = (tasks || []).indexOf(taskId);

  const totalTasks = data?.totalTasks;
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
    nextTask,
    prevTask,
    totalTasks,
  };
}

module.exports.prepareModuleData = prepareModuleData;
