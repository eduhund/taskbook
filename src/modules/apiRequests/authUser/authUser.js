const { log } = require("../../../utils/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { accessTokens } = require("../../userTokens/accessTokens");
const { checkPass } = require("../../../utils/pass");

const tokens = accessTokens;

async function authUser({ email, pass, lang }) {
  const user = await getDBRequest("getUserInfo", {
    query: { email },
  });
  if (user) {
    if (checkPass(user, pass)) {
      const userToken = tokens.setToken(user);
      lang !== user.lang &&
        getDBRequest("setUserInfo", { email, data: { lang } });
      log.info(`Auth success!`);
      return {
        status: 0,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          lang,
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
