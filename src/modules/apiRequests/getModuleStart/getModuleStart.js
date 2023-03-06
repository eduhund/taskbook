const { log } = require("../../../utils/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { getNextTaskId } = require("../../../utils/getNextTaskId");

async function getModuleStart({ userId, moduleId }) {
  const requests = [
    getDBRequest("getUserInfo", {
      query: { id: userId },
      returns: ["modules"],
    }),
    getDBRequest("getUserState", {
      query: { userId: userId, taskId: { $regex: `^${moduleId}` } },
    }),
    getDBRequest("getModuleInfo", {
      query: { code: moduleId },
      returns: ["name", "shortName", "lessons", "mascot", "intro"],
    }),
  ];

  const [userModules, userState, moduleData] = await Promise.all(requests);

  moduleData.deadline = userModules?.modules?.[moduleId]?.deadline;

  moduleData.nextTaskId = getNextTaskId(moduleData, userState);

  moduleData.lessons = Object.entries(moduleData?.lessons).map(([id, data]) => {
    return { id, title: data?.title, description: data?.description };
  });

  return {
    OK: true,
    data: moduleData,
  };
}

module.exports.getModuleStart = getModuleStart;
