const { checkToken } = require("../modules/checkAuth");

function executeWithLogin(req, res, tokens, process) {
  const token = req?.query?.access_token || req?.body?.access_token;
  const userId = checkToken(tokens, token)?.id;

  if (!userId) {
    res.status(401);
    res.send({
      OK: false,
      error: "invalid_credentials",
      error_description: "Invalid access token",
      error_code: 10003,
    });
  } else {
    try {
      process(req, res, userId);
    } catch (err) {
      res.status(500);
      res.send({
        OK: false,
        error: "internal_server_error",
        error_description: "Internal server error",
        error_code: 10005,
      });
    }
  }
}

module.exports.executeWithLogin = executeWithLogin;
