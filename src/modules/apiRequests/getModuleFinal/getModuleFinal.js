const { log } = require("../../../utils/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");

async function getModuleFinal({ userId, moduleId }) {
  const requests = [
    getDBRequest("getUserInfo", {
      query: { id: userId },
      returns: ["modules"],
    }),
    getDBRequest("getUserState", {
      query: {
        userId,
        taskId: { $regex: `^${moduleId}` },
      },
    }),
    getDBRequest("getModuleInfo", {
      query: { code: moduleId },
      returns: [
        "name",
        "shortName",
        "lessons",
        "final",
        "totalTasks",
        "mascot",
      ],
    }),
  ];
  const [userData, stateData, moduleData] = await Promise.all(requests);

  moduleData.deadline = userData?.modules?.[moduleId]?.deadline;

  let maxScore = 0;
  for (const lesson of Object.values(moduleData?.lessons)) {
    for (const task of lesson.tasks) {
      const taskData = await getDBRequest("getTaskInfo", {
        query: {
          id: task,
          type: "practice",
        },
        returns: ["maxScore"],
      });
      maxScore += taskData?.maxScore || 0;
    }
  }

  moduleData.maxScore = maxScore;

  delete moduleData.lessons;

  moduleData.score = stateData.reduce(
    (progress, value) => progress + (value?.score || 0),
    0
  );

  moduleData.doneTasks = stateData.reduce((progress, value) => {
    if (value.isChecked) {
      return progress + 1;
    } else return progress;
  }, 0);

  return {
    OK: true,
    data: moduleData,
  };
}

module.exports.getModuleFinal = getModuleFinal;
