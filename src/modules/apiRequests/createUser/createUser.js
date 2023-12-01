const { log } = require("../../../services/logger/logger");
const { db } = require("../../dbRequests/mongo");

function createUser(user) {
  log.info("Registering user: " + user);
  return db.USERS.countDocuments().then((totalUsers) => {
    const userId = `U${(totalUsers + 1).toString().padStart(7, "0")}`;
    user.id = userId;
    return db.USERS.insertOne(user).then(() => {
      return user;
    });
  });
}

module.exports.createUser = createUser;
