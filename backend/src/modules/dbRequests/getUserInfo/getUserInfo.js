const { USERS } = require("../../../services/mongo/mongo");

function getUserInfo({ query = {}, returns = [] }) {
  const projection = {
    _id: 0,
  };
  for (const param of returns) {
    projection[param] = 1;
  }
  return USERS.findOne(query, { projection });
}

module.exports = getUserInfo;
