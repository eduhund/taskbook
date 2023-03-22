const { log } = require("../utils/logger");

function lowerString(string) {
  try {
    const lowString = (string || "").toLowerCase();
    return lowString;
  } catch (e) {
    log.warn(e);
    return "";
  }
}

module.exports.lowerString = lowerString;
