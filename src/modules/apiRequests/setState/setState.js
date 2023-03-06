const { log } = require("../../../utils/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { getFullTaskId } = require("../../../utils/idExtractor");
const { getVisibilityUpdateList } = require("./getVisibilityUpdateList");
const { updateDependenciesTasks } = require("./updateDependenciesTasks");

async function setState({ userId, questionId, state }) {
  const taskId = getFullTaskId(questionId);

  const tasks = await getDBRequest("getTasksList", {
    query: {
      "content.questions.depends.parentId": { $regex: questionId },
      "content.questions.depends.type": "visibility",
    },
    returns: ["id", "content"],
  });

  const questions = getVisibilityUpdateList(tasks, questionId);

  await updateDependenciesTasks(userId, questions, state);

  try {
    const path = "data." + questionId + ".state";
    const query = { userId, taskId };
    const data = {
      [path]: state,
      inProcess: true,
    };
    const newState = await getDBRequest("setState", {
      query,
      state: data,
      returns: [],
    });
    return {
      OK: true,
      data: newState?.value?.data || {},
    };
  } catch (e) {
    log.warn(e);
    return {
      OK: false,
    };
  }
}

module.exports.setState = setState;
