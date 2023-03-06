const { getToken } = require("../../utils/tokenGenerator");

function tokenMachine() {
  const tokens = {};
  function checkToken(token) {
    return tokens?.[token];
  }

  function setToken(user) {
    const newToken = getToken();
    tokens[newToken.accessToken] = {
      id: user?.id,
    };
    return newToken;
  }

  function checkList() {
    return tokens;
  }
  return {
    checkToken,
    setToken,
    checkList,
  };
}

const accessTokens = tokenMachine();

module.exports.tokenMachine = tokenMachine;
module.exports.accessTokens = accessTokens;
