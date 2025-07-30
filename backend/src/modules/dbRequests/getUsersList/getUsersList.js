const { USERS } = require("../../../services/mongo/mongo");

function getUsersList({ query = {}, returns = [] }) {
  const projection = {
    _id: 0,
  };
  for (const param of returns) {
    projection[param] = 1;
  }
  return USERS.find(query, {
    projection,
  }).toArray();
}

module.exports = getUsersList;
