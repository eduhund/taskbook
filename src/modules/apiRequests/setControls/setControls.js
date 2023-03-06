const { log } = require("../../../utils/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");

async function setControls({ userId, taskId, controlsState }) {
  try {
    const query = { userId, taskId };
    await getDBRequest("setControls", {
      query,
      controlsState,
      returns: [],
    });
    return {
      OK: true,
    };
  } catch (e) {
    log.warn(e);
    return {
      OK: false,
    };
  }
}

module.exports.setControls = setControls;
