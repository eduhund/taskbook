const { checkToken } = require("../tokenMachine/tokenMachine");

const trustedMachines = process.env.TRUSTED || [];

/***
 * Function checks user access token.
 *
 * @param {boolean} wall Is requested method behind the wall
 *
 * @returns {boolean} Result of auth checking
 */
function checkAuth(wall) {
  return (req, res, next) => {
    req.data = {};

    const isTrustedMachine = trustedMachines.includes(req.ip);

    if (wall && isTrustedMachine) {
      req.data = {
        isAuth: true,
      };
    }

    if (wall && !isTrustedMachine) {
      const token = req?.headers?.accesstoken;
      const userId = checkToken(token)?.id;
      if (!userId) {
        next({ code: 10103 });
        return false;
      }
      req.data = {
        userId,
        isAuth: true,
        wall,
      };
    }

    next();
    return true;
  };
}

function checkAdmin(req, res, next) {
  if (Object.keys(req.body).includes("gumroad_fee")) {
    next();
    return;
  }

  const token = req?.headers?.accesstoken;
  const tokenData = checkToken(token);
  if (!tokenData) {
    next({ code: 10103 });
    return false;
  }

  if (!tokenData?.isAdmin) {
    next({ code: 10202 });
    return false;
  }

  next();
  return true;
}

module.exports = { checkAuth, checkAdmin };
