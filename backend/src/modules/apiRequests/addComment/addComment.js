const { log } = require("@logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { generateMessage } = require("../../../utils/messageGenerator");
const { sendMessage } = require("../../../services/assistant/assistant");
const { getModuleId } = require("@utils/idExtractor");

async function addComment(req, res) {
  const { userId } = req;
  const { taskId, comment, protest } = req.body;

  const query = { userId, taskId };
  const update = {
    ts: Date.now(),
    message: comment,
    protest,
    readedByTeacher: false,
  };

  await getDBRequest("setComment", {
    query,
    data: update,
    protest,
    returns: [],
  });

  const data = generateMessage(0, update);
  res.status(200).send(data);

  const { email, firstName, lastName, modules } = await getDBRequest(
    "getUserInfo",
    {
      query: { id: userId },
      returns: ["email", "firstName", "lastName", "modules"],
    }
  );

  const { name } = await getDBRequest("getTaskInfo", {
    query: { id: taskId },
    returns: ["name"],
  });

  const moduleId = getModuleId(taskId);

  const prevComments = modules[moduleId].totalComments;

  const totalComments = Boolean(comment)
    ? prevComments + 1
    : prevComments === 0
    ? 0
    : prevComments - 1;

  const updatedData = {
    [`modules.${moduleId}.totalComments`]: totalComments,
  };
  getDBRequest("setUserInfo", { id: userId, data: updatedData });

  const messageData = {
    type: "taskComment",
    data: {
      email,
      firstName,
      lastName,
      taskId: taskId,
      taskName: name,
    },
    text: comment,
  };

  sendMessage(messageData);

  log.info(`New comment from user ${userId}: ${comment}`);

  return;
}

module.exports = addComment;
