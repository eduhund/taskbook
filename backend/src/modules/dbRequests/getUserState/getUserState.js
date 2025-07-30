const { STATE } = require("../../../services/mongo/mongo");

function getUserState({ query = {}, returns = [] }) {
  const projection = {
    _id: 0,
  };
  for (const param of returns) {
    projection[param] = 1;
  }
  return STATE.find(query, { projection }).toArray();
}

module.exports = getUserState;
