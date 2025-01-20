// Deprecated

const { lowerString, upperString } = require("./stringProcessor");
const { hashPass } = require("../utils/pass");
const { lang } = require("../../config.json");

const requireParams = {
  ["/v2/public/checkModuleAvailability"]: ["email", "moduleId"],
  ["/v2/student/auth"]: ["email", "pass"],
  ["/v2/student/checkPayment"]: ["paymentId"],
  ["/v2/student/createPassword"]: ["email", "pass", "key"],
  ["/v2/student/getDashboard"]: ["accessToken"],
  ["/v2/student/getModuleInfo"]: ["moduleId", "accessToken"],
  ["/v2/student/getTask"]: ["taskId", "accessToken"],
  ["/v2/student/getModuleStart"]: ["moduleId", "accessToken"],
  ["/v2/student/getModuleFinal"]: ["moduleId", "accessToken"],
  ["/v2/student/getLessonStart"]: ["lessonId", "accessToken"],
  ["/v2/student/getLessonFinal"]: ["lessonId", "accessToken"],
  ["/v2/student/getLessonsList"]: ["moduleId", "accessToken"],
  ["/v2/student/getTasksList"]: ["lessonId", "accessToken"],
  ["/v2/student/getDiploma"]: ["moduleId", "accessToken"],
  ["/v2/student/setState"]: ["questionId", "state", "accessToken"],
  ["/v2/student/checkTask"]: ["taskId", "isChecked", "protest", "accessToken"],
  ["/v2/student/setControls"]: ["taskId", "controlsState", "accessToken"],
  ["/v2/student/addComment"]: ["taskId", "comment", "protest", "accessToken"],
  ["/v2/student/getCounselor"]: ["lang", "accessToken"],
};

function paramsProcessor(req, res, next) {
  const { data = {}, path, query = {}, body = {} } = req;
  const params = { ...query, ...body };
  for (const param of requireParams[path] || []) {
    if (!(param in params)) {
      next({ code: 10101 });
      return;
    }
  }

  if ("email" in params) {
    params.email = lowerString(params.email);
  }

  if ("pass" in params) {
    params.pass = hashPass(params.pass);
  }

  if ("lang" in params) {
    params.lang = lang.supported.includes(params.lang)
      ? params.lang
      : lang.default;
  }

  if ("moduleId" in params) {
    params.moduleId = upperString(params.moduleId);
  }

  if ("lessonId" in params) {
    params.lessonId = upperString(params.lessonId);
  }

  if ("taskId" in params) {
    params.taskId = upperString(params.taskId);
  }

  if ("questionId" in params) {
    params.questionId = upperString(params.questionId);
  }

  req.data = Object.assign(data, params);

  next();
}

module.exports = { paramsProcessor };
