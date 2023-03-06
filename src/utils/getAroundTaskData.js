const { getDBRequest } = require("../modules/dbRequests/dbRequests");

async function getAroundTaskData(taskId) {
  const nearTask = await getDBRequest("getTaskInfo", {
    query: { id: taskId },
    returns: ["id", "name", "type"],
  });
  return nearTask;
}

module.exports.getAroundTaskData = getAroundTaskData;
