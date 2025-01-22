const { log } = require("@logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");

const {
  calculateScore,
  calculateDefaultScore,
} = require("../../../utils/calculators");
const { generateMessage } = require("../../../utils/messageGenerator");
const { getModuleId } = require("@utils/idExtractor");

async function updateTaskState(query, state) {
  return getDBRequest("setState", {
    query,
    state,
    returns: ["score"],
  });
}

function updateUserState(userData, moduleId, state) {
  const { id } = userData;

  const {
    doneTasks: prevDoneTasks = 0,
    forsakenTasks: prevForsakenTasks = 0,
    totalScore: prevTotalScore = 0,
    protest: prevProtest = 0,
  } = userData?.modules?.[moduleId] || {};

  const { score, isChecked, protest } = state;

  const doneTasks = isChecked
    ? prevDoneTasks + 1
    : prevDoneTasks === 0
    ? 0
    : prevDoneTasks - 1;
  const forsakenTasks = !isChecked
    ? prevForsakenTasks + 1
    : prevForsakenTasks === 0
    ? 0
    : prevForsakenTasks - 1;
  const totalScore = isChecked
    ? prevTotalScore + score
    : prevTotalScore < -score
    ? 0
    : prevTotalScore - score;
  const totalProtest = protest
    ? prevProtest + 1
    : prevProtest === 0
    ? 0
    : prevProtest - 1;

  const updatedData = {
    [`modules.${moduleId}.doneTasks`]: doneTasks,
    [`modules.${moduleId}.forsakenTasks`]: forsakenTasks,
    [`modules.${moduleId}.totalScore`]: totalScore,
    [`modules.${moduleId}.totalProtests`]: totalProtest,
  };
  return getDBRequest("setUserInfo", { id, data: updatedData });
}

async function checkTask(req, res) {
  try {
    const userId = req?.userId;
    const { taskId, isChecked, protest } = req.body;

    const requests = [
      getDBRequest("getTaskInfo", {
        query: { id: taskId },
      }),
      getDBRequest("getStateInfo", {
        query: { userId, taskId },
      }),
      getDBRequest("getUserInfo", {
        query: { id: userId },
      }),
    ];

    let score = 0;
    const [taskData, stateData, userData] = await Promise.all(requests);

    if (isChecked) {
      if (protest) {
        score = taskData?.maxScore;
      } else if (!stateData?.data) {
        score = calculateDefaultScore(taskData?.content);
      } else {
        score = calculateScore(stateData?.data, taskData);
      }
    }

    updateTaskState({ userId, taskId }, { score, isChecked, protest });
    updateUserState(userData, getModuleId(taskData?.id), {
      score,
      isChecked,
      protest,
    });

    const data = generateMessage(0, { score });
    res.status(200).send(data);

    return;
  } catch (error) {
    log.error(error);
    const data = generateMessage(20100);
    res.status(500).send(data);
    return;
  }
}

module.exports = checkTask;
