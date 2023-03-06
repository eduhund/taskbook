function rand() {
  return Math.random().toString(36).substring(2);
}

function getToken() {
  const accessToken = rand() + rand();
  const refreshToken = rand();
  const expiresIn = Math.floor(Date.now() / 1000 + 7200);
  return {
    accessToken,
    expiresIn,
    refreshToken,
  };
}

module.exports.getToken = getToken;
