const { log } = require("../../../utils/logger");
const { db } = require("../mongo");

function addUserAction({ userId, action, data, params }) {
  return db.ACTIONS.insertOne({
    ts: Date.now(),
    userId,
    action,
    data,
    params,
  });
}

module.exports.addUserAction = addUserAction;
