const { log } = require("../../../utils/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { accessTokens } = require("../../userTokens/accessTokens");
const { checkPass } = require("../../../utils/pass");

const tokens = accessTokens;

async function authUser({ email, pass }) {
  const user = await getDBRequest("getUserInfo", {
    query: { email },
  });
  if (user) {
    if (checkPass(user, pass)) {
      const userToken = tokens.setToken(user);
      log.info(`Auth success!`);
      log.debug(tokens.checkList());
      return {
        status: 0,
        data: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          id: user.id,
          token: userToken,
        },
      };
    } else {
      log.info(`Password is invalid!`);
      return {
        status: 10002,
        error: "invalid_credentials",
        error_description: "Invalid password",
      };
    }
  } else {
    log.info(`User ${email} didn't found!`);
    return {
      status: 10001,
      error: "invalid_credentials",
      error_description: "User didn't found",
    };
  }
}

module.exports.authUser = authUser;
