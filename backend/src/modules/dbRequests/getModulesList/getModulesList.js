const { MODULES } = require("../../../services/mongo/mongo");

function getModulesList({ query = {}, returns = [] }) {
  const projection = {
    _id: 0,
  };
  for (const param of returns) {
    projection[param] = 1;
  }
  return MODULES.find(query, {
    projection,
  }).toArray();
}

module.exports = getModulesList;
