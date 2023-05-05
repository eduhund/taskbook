const getUser = require("./getUser/getUser");
const checkCredentials = require("./checkCredentials/checkCredentials");
const checkTransaction = require("./checkTransaction/checkTransaction");
const checkOTK = require("./checkOTK/checkOTK");
const authUser = require("./authUser/authUser");
const updatePass = require("./updatePass/updatePass");
const getModuleInfo = require("./getModuleInfo/getModuleInfo");
const getLessonInfo = require("./getLessonInfo/getLessonInfo");
const getTaskInfo = require("./getTaskInfo/getTaskInfo");
const getStateInfo = require("./getStateInfo/getStateInfo");
const prepareData = require("./prepareData/prepareData");
const setTaskState = require("./setTaskState/setTaskState");
const pushComment = require("./pushComment/pushComment");
const setDiploma = require("./setDiploma/setDiploma");

module.exports = {
	getUser,
	checkCredentials,
	checkTransaction,
	checkOTK,
	authUser,
	updatePass,
	getModuleInfo,
	getLessonInfo,
	getTaskInfo,
	getStateInfo,
	prepareData,
	setTaskState,
	pushComment,
	setDiploma,
};
