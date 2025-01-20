const { CERTS } = require("../services/mongo/mongo");
const { getDBRequest } = require("../modules/dbRequests/dbRequests");

function padder(number = 0, count = 1) {
  return number.toString().padStart(count, "0");
}

async function generateCertId(userId, moduleId, startDate) {
  const certsCount = (await CERTS.count({ moduleId, startDate })) || 0;

  const postfix = padder(certsCount + 1, 4);
  const date = new Date(Date.parse(startDate));
  const datePart = `${padder(date.getFullYear() - 2000, 2)}${padder(
    date.getMonth(),
    2
  )}`;
  const certId = `${moduleId}${datePart}${postfix}`;

  getDBRequest("setDiploma", {
    query: {
      id: certId,
    },
    data: {
      userId,
      moduleId,
      startDate,
      public: false,
    },
  });

  const path = `modules.${moduleId}.certId`;

  getDBRequest("setUserInfo", {
    query: { id: userId },
    data: { [path]: certId },
  });

  return certId;
}

module.exports = generateCertId;
