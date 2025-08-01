const { STATE } = require("../../../services/mongo/mongo");

function getStateInfo({ query = {}, returns = [] }) {
  const projection = {
    _id: 0,
  };
  for (const param of returns) {
    projection[param] = 1;
  }
  return STATE.findOne(query, { projection });
}

module.exports = getStateInfo;
