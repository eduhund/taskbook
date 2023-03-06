const { log } = require("../../../utils/logger");
const { db } = require("../mongo");

async function setPassword({ email, pass }) {
  log.debug("Set password for login: " + email);
  return db.USERS.findOneAndUpdate(
    { email },
    { $set: { pass } },
    { upsert: true, returnDocument: "after", returnNewDocument: true }
  ).then((user) => {
    log.info("Updated user: " + user);
    return user.value;
  });
}

module.exports.setPassword = setPassword;
