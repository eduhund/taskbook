const { USERS } = require("../../../services/mongo/mongo");

async function addUser(user) {
  return USERS.countDocuments().then((totalUsers) => {
    const userId = `U${(totalUsers + 1).toString().padStart(7, "0")}`;
    user.id = userId;
    return USERS.insertOne(user).then(() => {
      return user;
    });
  });
}

module.exports = addUser;
