const { db } = require("../modules/dbRequests/mongo");
const { log } = require("../utils/logger");

const { accessTokens } = require("../modules/userTokens/accessTokens");
const { getModuleId } = require("./idExtractor");

function checkAuth(req, res, next) {
  const token = req?.query?.accessToken || req?.body?.accessToken;
  const userId = accessTokens.checkList()?.[token]?.id;
  log.debug(token);
  log.debug(userId);

  if (!userId) {
    res.status(401);
    res.send({
      OK: false,
      error: "invalid_credentials",
      error_description: "Invalid access token",
      error_code: 10003,
    });
  } else {
    req.userId = userId;
    next();
  }
}

/**
 * Validate active user token
 * @param {Object} tokenList
 * @param {string} token
 * @returns {string | null}
 */
function checkToken(tokenList = {}, token = "") {
  return tokenList?.[token] || null;
}

function checkDate(start, deadline) {
  if (!start && !deadline) return undefined;
  const today = Date.now();
  return today >= Date.parse(start) && today < Date.parse(deadline)
    ? true
    : false;
}

/**
 * Check student access to module data
 * @param {string} userId
 * @param {string} moduleId
 * @returns {boolean}
 */
function checkModuleAccess(req, res, next) {
  const userId = req.userId;

  const lessonId = req?.query?.lessonId || req?.body?.lessonId;
  const taskId = req?.query?.taskId || req?.body?.taskId;
  const questionId = req?.query?.questionId || req?.body?.questionId;
  const moduleId =
    req?.query?.moduleId ||
    req?.body?.moduleId ||
    getModuleId(lessonId || taskId || questionId);

  log.info("Checking user access...");
  db.USERS.findOne({ id: userId }).then((user) => {
    startDate = user?.modules?.[moduleId]?.start;
    deadline = user?.modules?.[moduleId]?.deadline;
    if (checkDate(startDate, deadline)) {
      log.info("User", userId, "have access to module", moduleId);
      next();
    } else {
      log.info("User", userId, "doesn't have access to module", moduleId);
      res.status(403);
      res.send({
        OK: false,
        error: "blocked_content",
        error_description: "User don't have access to this content",
        error_code: 10011,
      });
    }
  });
}

/**
 * Check student access to module module final and certificate
 * @param {string} userId
 * @param {string} moduleId
 * @returns {boolean}
 */
function checkCertAccess(req, res, next) {
  const userId = req.userId;

  const moduleId = req?.query?.moduleId || req?.body?.moduleId;

  log.info("Checking user access...");
  db.USERS.findOne({ id: userId }).then((user) => {
    const modules = Object.keys(user?.modules);
    if (modules.includes(moduleId)) {
      log.info("User", userId, "have access to certificate", moduleId);
      next();
    } else {
      log.info("User", userId, "doesn't have access to certificate", moduleId);
      res.status(403);
      res.send({
        OK: false,
        error: "blocked_content",
        error_description: "User don't have access to this content",
        error_code: 10011,
      });
    }
  });
}

module.exports.checkToken = checkToken;
module.exports.checkAuth = checkAuth;
module.exports.checkModuleAccess = checkModuleAccess;
module.exports.checkCertAccess = checkCertAccess;
