const { USERS } = require("../services/mongo/mongo");
const accessTokens = require("../services/tokenMachine/tokenMachine");
const { getModuleId } = require("./idExtractor");
const { generateMessage } = require("./messageGenerator");

const { TRUSTED = [], ADMIN_TOKEN = null } = process.env;

function checkAuth(req, res, next) {
  const preUserId = req?.query?.userId || req?.body?.userId;
  const token =
    req?.headers?.accesstoken ||
    req?.query?.accessToken ||
    req?.body?.accessToken;
  const tokenData = accessTokens.checkToken(token);

  if (
    (TRUSTED.includes(req.ip) || token === ADMIN_TOKEN || tokenData?.isAdmin) &&
    preUserId
  ) {
    req.userId = preUserId;
    next();
    return;
  }

  const userId = tokenData?.id;

  if (!userId) {
    const error = generateMessage(10105);
    res.status(401).send(error);
    return error;
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
  const UTCMidnight = new Date(deadline);
  UTCMidnight.setUTCHours(23, 59, 59, 0);
  const UTCDeadline = Date.parse(UTCMidnight);
  return today >= Date.parse(start) && today <= UTCDeadline ? true : false;
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

  USERS.findOne({ id: userId }).then((user) => {
    startDate = user?.modules?.[moduleId]?.start;
    deadline = user?.modules?.[moduleId]?.deadline;
    if (checkDate(startDate, deadline)) {
      next();
    } else {
      const error = generateMessage(10201);
      res.status(403).send(error);
      return error;
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

  const lessonId = req?.query?.lessonId || req?.body?.lessonId;
  const moduleId =
    req?.query?.moduleId || req?.body?.moduleId || getModuleId(lessonId);

  USERS.findOne({ id: userId }).then((user) => {
    const modules = Object.keys(user?.modules || {});
    if (modules.includes(moduleId)) {
      next();
    } else {
      const error = generateMessage(10201);
      res.status(403).send(error);
      return error;
    }
  });
}

module.exports = { checkToken, checkAuth, checkModuleAccess, checkCertAccess };
