const { authUser } = require("./authUser/authUser");
const { getTask } = require("./getTask/getTask");
const { checkTask } = require("./checkTask/checkTask");
const { setState } = require("./setState/setState");
const { setControls } = require("./setControls/setControls");
const { getDashboard } = require("./getDashboard/getDashboard");
const { getModuleStart } = require("./getModuleStart/getModuleStart");
const { getModuleFinal } = require("./getModuleFinal/getModuleFinal");
const { getLessonStart } = require("./getLessonStart/getLessonStart");
const { getLessonFinal } = require("./getLessonFinal/getLessonFinal");
const { getDiploma } = require("./getDiploma/getDiploma");
const { getModuleInfo } = require("./getModuleInfo/getModuleInfo");
const { getLessonsList } = require("./getLessonsList/getLessonsList");
const { getTasksList } = require("./getTasksList/getTasksList");
const { addComment } = require("./addComment/addComment");
const { getCounselor } = require("./getCounselor/getCounselor");

const REQUESTS = {
  authUser,
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
};

function getApiRequest(type, params) {
  return REQUESTS[type](params);
}

module.exports.getApiRequest = getApiRequest;
