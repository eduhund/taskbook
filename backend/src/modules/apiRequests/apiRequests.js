const { log } = require("@logger");

const auth = require("./auth/auth");
const checkPayment = require("./checkPayment/checkPayment");
const createPassword = require("./createPassword/createPassword");
const getTask = require("./getTask/getTask");
const checkTask = require("./checkTask/checkTask");
const setState = require("./setState/setState");
const setControls = require("./setControls/setControls");
const getDashboard = require("./getDashboard/getDashboard");
const getModuleStart = require("./getModuleStart/getModuleStart");
const getModuleFinal = require("./getModuleFinal/getModuleFinal");
const getLessonStart = require("./getLessonStart/getLessonStart");
const getLessonFinal = require("./getLessonFinal/getLessonFinal");
const getDiploma = require("./getDiploma/getDiploma");
const getModuleInfo = require("./getModuleInfo/getModuleInfo");
const getLessonsList = require("./getLessonsList/getLessonsList");
const getTasksList = require("./getTasksList/getTasksList");
const addComment = require("./addComment/addComment");
const getCounselor = require("./getCounselor/getCounselor");

const resetPassword = require("./resetPassword/resetPassword");
const createUser = require("./createUser/createUser");
const updateUser = require("./updateUser/updateUser");
const getStudentsList = require("./getStudentsList/getStudentsList");
const getModulesList = require("./getModulesList/getModulesList");
const changeCommentStatus = require("./changeCommentStatus/changeCommentStatus");
const getCommentsList = require("./getCommentsList/getCommentsList");
const newPayment = require("./newPayment/newPayment");
const sendAnswer = require("./sendAnswer/sendAnswer");

const {
  checkAuth,
  checkModuleAccess,
  checkCertAccess,
} = require("../../utils/checkAuth");

const REQUESTS = {
  auth,
  checkPayment,
  createPassword,
  getTask,
  checkTask,
  setState,
  setControls,
  getDashboard,
  getModuleStart,
  getModuleFinal,
  getLessonStart,
  getLessonFinal,
  getDiploma,
  getModuleInfo,
  getLessonsList,
  getTasksList,
  addComment,
  getCounselor,
  resetPassword,
  createUser,
  updateUser,
  getStudentsList,
  getModulesList,
  changeCommentStatus,
  getCommentsList,
  newPayment,
  sendAnswer,
};

const PUBLIC = [
  {
    name: "auth",
    method: "post",
    path: "/auth",
    exec: [(req, res, next) => getApiRequest("auth", { req, res, next })],
  },
  {
    name: "checkPayment",
    method: "post",
    path: "/checkPayment",
    exec: [
      (req, res, next) => getApiRequest("checkPayment", { req, res, next }),
    ],
  },
  {
    name: "createPassword",
    method: "post",
    path: "/createPassword",
    exec: [
      (req, res, next) => getApiRequest("createPassword", { req, res, next }),
      (req, res, next) => getApiRequest("auth", { req, res, next }),
    ],
  },
  {
    name: "getDashboard",
    method: "get",
    path: "/getDashboard",
    exec: [
      checkAuth,
      (req, res, next) => getApiRequest("getDashboard", { req, res, next }),
    ],
  },
  {
    name: "getModuleInfo",
    method: "get",
    path: "/getModuleInfo",
    exec: [
      checkAuth,
      checkCertAccess,
      (req, res, next) => getApiRequest("getModuleInfo", { req, res, next }),
    ],
  },
  {
    name: "getTask",
    method: "get",
    path: "/getTask",
    exec: [
      checkAuth,
      checkModuleAccess,
      (req, res, next) => getApiRequest("getTask", { req, res, next }),
    ],
  },
  {
    name: "getModuleStart",
    method: "get",
    path: "/getModuleStart",
    exec: [
      checkAuth,
      checkModuleAccess,
      (req, res, next) => getApiRequest("getModuleStart", { req, res, next }),
    ],
  },
  {
    name: "getModuleFinal",
    method: "get",
    path: "/getModuleFinal",
    exec: [
      checkAuth,
      checkCertAccess,
      (req, res, next) => getApiRequest("getModuleFinal", { req, res, next }),
    ],
  },
  {
    name: "getLessonStart",
    method: "get",
    path: "/getLessonStart",
    exec: [
      checkAuth,
      checkModuleAccess,
      (req, res, next) => getApiRequest("getLessonStart", { req, res, next }),
    ],
  },
  {
    name: "getLessonFinal",
    method: "get",
    path: "/getLessonFinal",
    exec: [
      checkAuth,
      checkModuleAccess,
      (req, res, next) => getApiRequest("getLessonFinal", { req, res, next }),
    ],
  },
  {
    name: "getLessonsList",
    method: "get",
    path: "/getLessonsList",
    exec: [
      checkAuth,
      checkCertAccess,
      (req, res, next) => getApiRequest("getLessonsList", { req, res, next }),
    ],
  },
  {
    name: "getTasksList",
    method: "get",
    path: "/getTasksList",
    exec: [
      checkAuth,
      checkCertAccess,
      (req, res, next) => getApiRequest("getTasksList", { req, res, next }),
    ],
  },
  {
    name: "getDiploma",
    method: "get",
    path: "/getDiploma",
    exec: [
      checkAuth,
      checkCertAccess,
      (req, res, next) => getApiRequest("getDiploma", { req, res, next }),
    ],
  },
  {
    name: "setState",
    method: "post",
    path: "/setState",
    exec: [
      checkAuth,
      checkModuleAccess,
      (req, res, next) => getApiRequest("setState", { req, res, next }),
    ],
  },
  {
    name: "checkTask",
    method: "post",
    path: "/checkTask",
    exec: [
      checkAuth,
      checkModuleAccess,
      (req, res, next) => getApiRequest("checkTask", { req, res, next }),
    ],
  },
  {
    name: "setControls",
    method: "post",
    path: "/setControls",
    exec: [
      checkAuth,
      checkModuleAccess,
      (req, res, next) => getApiRequest("setControls", { req, res, next }),
    ],
  },
  {
    name: "addComment",
    method: "post",
    path: "/addComment",
    exec: [
      checkAuth,
      checkModuleAccess,
      (req, res, next) => getApiRequest("addComment", { req, res, next }),
    ],
  },
  {
    name: "getCounselor",
    method: "get",
    path: "/getCounselor",
    exec: [
      checkAuth,
      (req, res, next) => getApiRequest("getCounselor", { req, res, next }),
    ],
  },
];

const TEACHER = [
  {
    name: "createUser",
    method: "post",
    path: "/createUser",
    exec: [(req, res, next) => getApiRequest("createUser", { req, res, next })],
  },
  {
    name: "resetPassword",
    method: "post",
    path: "/resetPassword",
    exec: [
      (req, res, next) => getApiRequest("resetPassword", { req, res, next }),
    ],
  },
  {
    name: "updateUser",
    method: "post",
    path: "/updateUser",
    exec: [(req, res, next) => getApiRequest("updateUser", { req, res, next })],
  },
  {
    name: "getStudentsList",
    method: "get",
    path: "/getStudentsList",
    exec: [
      (req, res, next) => getApiRequest("getStudentsList", { req, res, next }),
    ],
  },
  {
    name: "getModulesList",
    method: "get",
    path: "/getModulesList",
    exec: [
      (req, res, next) => getApiRequest("getModulesList", { req, res, next }),
    ],
  },
  {
    name: "getCommentsList",
    method: "get",
    path: "/getCommentsList",
    exec: [
      (req, res, next) => getApiRequest("getCommentsList", { req, res, next }),
    ],
  },
  {
    name: "changeCommentStatus",
    method: "post",
    path: "/changeCommentStatus",
    exec: [
      (req, res, next) =>
        getApiRequest("changeCommentStatus", { req, res, next }),
    ],
  },
  {
    name: "newPayment",
    method: "post",
    path: "/newPayment",
    exec: [(req, res, next) => getApiRequest("newPayment", { req, res, next })],
  },
  {
    name: "sendMail",
    method: "post",
    path: "/sendMail",
    exec: [(req, res, next) => getApiRequest("sendAnswer", { req, res, next })],
  },
];

async function getApiRequest(type, { req, res, next }) {
  try {
    return REQUESTS[type](req, res, next);
  } catch (e) {
    log.error(`Error in API method: ${type}.`);
    log.debug(req.userId, req.query, req.body);
    log.debug(e);
    res.sendStatus(500);
    return;
  }
}

module.exports = { PUBLIC, TEACHER, getApiRequest };
