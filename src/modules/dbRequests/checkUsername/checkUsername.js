const { USERS } = require("../mongo");

async function checkUsername({ email }) {
  return USERS.findOne({ email }).then((user) => {
    if (user) {
      return user;
    } else return false;
  });
}

module.exports = checkUsername