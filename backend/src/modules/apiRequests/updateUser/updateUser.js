const { log } = require("../../../services/logger/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { lowerString } = require("../../../utils/stringProcessor");
const { generateMessage } = require("../../../utils/messageGenerator");
const { normalizeISODate } = require("../../../utils/date");
const { getDeadline } = require("../../../utils/access");

async function updateUser(req, res) {
  const {
    id,
    email,
    firstName,
    lastName,
    lang,
    gender,
    modules = [],
  } = req.body;

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

  const userModules = {};
  const currentUser = await getDBRequest("getUserInfo", {
    query: { id },
    returns: ["modules"],
  });

  for (const { id, start, deadline } of modules) {
    if (start) {
      const normalizedStart = normalizeISODate(start);
      if (!normalizedStart) {
        res.status(400);
        res.send({
          OK: false,
          error: "invalid_params",
          error_description: "Invalid start date format",
        });
        return;
      }
      const startString = `modules.${id}.start`;
      userModules[startString] = normalizedStart;
    }

    if (deadline) {
      const normalizedDeadline = normalizeISODate(deadline);
      if (!normalizedDeadline) {
        res.status(400);
        res.send({
          OK: false,
          error: "invalid_params",
          error_description: "Invalid deadline date format",
        });
        return;
      }
      const deadlineString = `modules.${id}.deadline`;
      userModules[deadlineString] = normalizedDeadline;

      const currentProlongations = currentUser?.modules?.[id]?.prolongations;
      if (Array.isArray(currentProlongations)) {
        const trimmedProlongations = currentProlongations
          .map((item) => {
            const normalizedUntil = normalizeISODate(item?.until);
            if (!normalizedUntil) {
              return null;
            }
            return { ...item, until: normalizedUntil };
          })
          .filter(
            (item) =>
              item !== null && Date.parse(item.until) <= Date.parse(normalizedDeadline)
          );

        userModules[`modules.${id}.prolongations`] = trimmedProlongations;
      }
    }
  }

  const data = {
    email: lowerString(email),
    firstName,
    lastName,
    lang,
    gender,
    ...userModules,
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

    const userModules = Object.entries(updatedUser.modules || {}).map(
      ([key, value]) => {
        const { start } = value;
        return {
          id: key,
          start,
          deadline: getDeadline(value),
        };
      }
    );

    updatedUser.modules = userModules;

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
