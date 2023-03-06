const { log } = require("../../../utils/logger");
const { db } = require("../mongo");

function getTaskInfo({ query = {}, returns = [] }) {
  const projection = {
    _id: 0,
  };
  for (const param of returns) {
    projection[param] = 1;
  }
  return db.TASKS.findOne(query, { projection });
}

module.exports.getTaskInfo = getTaskInfo;
