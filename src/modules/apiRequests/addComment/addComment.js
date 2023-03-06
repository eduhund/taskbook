const { log } = require("../../../utils/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");

async function addComment({ userId, taskId, comment, protest }) {
  const query = { userId, taskId };
  const data = {
    ts: Date.now(),
    message: comment,
    protest,
    readedByTeacher: false,
  };
  try {
    await getDBRequest("setComment", {
      query,
      data,
      protest,
      returns: [],
    });
    return {
      OK: true,
      data,
    };
  } catch (e) {
    log.warn(e);
    return {
      OK: false,
    };
  }
}

module.exports.addComment = addComment;
