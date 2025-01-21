const { log } = require("../../../services/logger/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { lowerString } = require("../../../utils/stringProcessor");
const { generateMessage } = require("../../../utils/messageGenerator");

async function updateUser(req, res) {
  const { id, email, firstName, lastName, lang, gender } = req.body;

  if (!id) {
    res.status(401);
    res.send({
      OK: false,
      error: "missing_parameters",
      error_description: "Missing required parameters",
      error_code: 10008,
    });
    return;
  }

  const data = {
    email: lowerString(email),
    firstName,
    lastName,
    lang,
    gender,
  };

  for (const key of Object.keys(data)) {
    if (!data[key]) delete data[key];
  }

  const updatedUser = await getDBRequest("setUserInfo", {
    id,
    data,
  });

  if (updatedUser) {
    delete updatedUser.pass;
    const sendData = {
      OK: true,
      data: updatedUser,
    };

    const data = generateMessage(0, sendData);
    res.status(200).send(data);
  } else {
    res.status(401);
    res.send({
      OK: false,
      error: "updating_error",
      error_description: "Error while updating user",
      error_code: 10009,
    });
  }

  return;
}

module.exports = updateUser;
