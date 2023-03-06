const { log } = require("../../../utils/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { getModuleId, getLessonId } = require("../../../utils/idExtractor");
const { calculateMaxScore } = require("../../../utils/calculators");

async function getTasksList({ userId, fullLessonId }) {
  const moduleId = getModuleId(fullLessonId);
  const lessonId = getLessonId(fullLessonId);

  const moduleDate = await getDBRequest("getModuleInfo", {
    query: { code: moduleId },
    returns: ["lessons"],
  });

  const tasksList = [];

  for (const taskId of moduleDate?.lessons?.[lessonId]?.tasks || []) {
    const taskData = await getDBRequest("getTaskInfo", {
      query: { id: taskId },
      returns: ["id", "type", "title", "name", "maxScore"],
    });

    switch (taskData?.type) {
      case "practice":
        taskData.label = taskData?.name;
        //taskData.maxScore = calculateMaxScore(taskData);

        const taskState = await getDBRequest("getStateInfo", {
          query: { userId, taskId },
        });

        taskData.score = taskState?.score >= 0 ? taskState?.score : null;
        taskData.isChecked =
          taskState?.is_checked || taskState?.isChecked || false;
        taskData.inProcess = taskState?.inProcess;

        break;

      case "theory":
        taskData.label = "Теория";

        break;
    }

    tasksList.push(taskData);
  }

  return {
    OK: true,
    data: tasksList,
  };
}

module.exports.getTasksList = getTasksList;
