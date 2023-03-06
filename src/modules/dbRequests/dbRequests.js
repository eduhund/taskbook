require("dotenv").config();

const { getUserInfo } = require("./getUserInfo/getUserInfo");
const { getUserState } = require("./getUserState/getUserState");
const { getUsersList } = require("./getUsersList/getUsersList");
const { getModuleInfo } = require("./getModuleInfo/getModuleInfo");
const { getTaskInfo } = require("./getTaskInfo/getTaskInfo");
const { getStateInfo } = require("./getStateInfo/getStateInfo");
const { getModulesList } = require("./getModulesList/getModulesList");
const { getTasksList } = require("./getTasksList/getTasksList");
const { setComment } = require("./setComment/setComment");
const { setState } = require("./setState/setState");
const { setControls } = require("./setControls/setControls");
const { addUserAction } = require("./addUserAction/addUserAction");
const { setPassword } = require("./setPassword/setPassword");

const REQUESTS = {
  getUserInfo,
  getUserState,
  getUsersList,
  getModuleInfo,
  getTaskInfo,
  getStateInfo,
  getModulesList,
  getTasksList,
  setComment,
  setState,
  setControls,
  addUserAction,
  setPassword,
};

function getDBRequest(type, params) {
  return REQUESTS[type](params);
}

module.exports.getDBRequest = getDBRequest;
