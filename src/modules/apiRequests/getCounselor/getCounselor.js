const { log } = require("../../../utils/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");

async function getCounselor() {
  const data = await getDBRequest("getCounselor", { lang: "ru" });

  return {
    OK: true,
    data,
  };
}

module.exports.getCounselor = getCounselor;
