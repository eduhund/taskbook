const { log } = require("../../../utils/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");

const {
  calculateScore,
  calculateDefaultScore,
} = require("../../../utils/calculators");

async function checkTask({ userId, taskId, isChecked, protest }) {
  const requests = [
    getDBRequest("getTaskInfo", {
      query: { id: taskId },
    }),
    getDBRequest("getStateInfo", {
      query: { userId, taskId },
    }),
  ];

  const [taskData, stateData] = await Promise.all(requests);

  let score = 0;
  if (isChecked) {
    if (protest) {
      score = taskData?.maxScore;
    } else if (!stateData?.data) {
      score = calculateDefaultScore(taskData?.content);
    } else {
      score = calculateScore(stateData?.data, taskData);
    }
  }

  try {
    const query = { userId, taskId };
    getDBRequest("setState", {
      query,
      state: { score, isChecked, protest },
      returns: ["score"],
    });
    return {
      OK: true,
      data: {
        score,
      },
    };
  } catch (e) {
    log.warn(e);
    return {
      OK: false,
    };
  }
}

module.exports.checkTask = checkTask;
