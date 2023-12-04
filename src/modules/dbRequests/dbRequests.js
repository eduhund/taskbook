const getUserInfo = require("./getUserInfo/getUserInfo");
const getUserState = require("./getUserState/getUserState");
const getUsersList = require("./getUsersList/getUsersList");
const getModuleInfo = require("./getModuleInfo/getModuleInfo");
const getTaskInfo = require("./getTaskInfo/getTaskInfo");
const getStateInfo = require("./getStateInfo/getStateInfo");
const getModulesList = require("./getModulesList/getModulesList");
const getTasksList = require("./getTasksList/getTasksList");
const setComment = require("./setComment/setComment");
const setState = require("./setState/setState");
const setControls = require("./setControls/setControls");
const addUserAction = require("./addUserAction/addUserAction");
const setUserInfo = require("./setUserInfo/setUserInfo");
const getCounselor = require("./getCounselor/getCounselor");
const getPaymentInfo = require("./getPaymentInfo/getPaymentInfo");
const getDiploma = require("./getDiploma/getDiploma");
const setDiploma = require("./setDiploma/setDiploma");
const checkUsername = require("./checkUsername/checkUsername")
const setPayment = require("./setPayment/setPayment");

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
	setUserInfo,
	getCounselor,
	getPaymentInfo,
	getDiploma,
	setDiploma,
	checkUsername,
	setPayment
};

function getDBRequest(type, params) {
	return REQUESTS[type](params);
}

module.exports.getDBRequest = getDBRequest;
