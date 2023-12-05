const { log } = require("../../../services/logger/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { lowerString } = require("../../../utils/stringProcessor")
const { setKey } = require("../../../services/tokenMachine/OTK")

async function resetPassword({ req, res }) {
    const email = lowerString(req.body.email);
    const user = await getDBRequest("checkUsername", { email })
  
    if (user) {
      const { id, email } = user
      const secureKey = await setKey(user?.id, "oneTimeKey");
      res.status(200);
      res.send({
        OK: true,
        data: {
          id,
          email,
          key: secureKey,
        },
      });
    } else {
      res.status(401);
      res.send({
        OK: false,
        error: "invalid_credentials",
        error_description: "User didn't found",
        error_code: 10001,
      });
    }
  return
};

module.exports = resetPassword