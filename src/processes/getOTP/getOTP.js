const { setKey } = require("../../services/tokenMachine/OTK")

async function getOTP(userId) {
  return await setKey(userId, "oneTimePass")
}

module.exports = getOTP