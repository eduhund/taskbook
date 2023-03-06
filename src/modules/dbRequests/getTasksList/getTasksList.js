const { log } = require("../../../utils/logger");
const { db } = require("../mongo");

function getTasksList({ query = {}, returns = [] }) {
  const projection = {
    _id: 0,
  };
  for (const param of returns) {
    projection[param] = 1;
  }
  return db.TASKS.find(query, {
    projection,
  }).toArray();
}

module.exports.getTasksList = getTasksList;
