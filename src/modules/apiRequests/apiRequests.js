const { log } = require("../../utils/logger");

const { auth } = require("./auth/auth");
const { createPassword } = require("./createPassword/createPassword");
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

const {
	checkAuth,
	checkModuleAccess,
	checkCertAccess,
} = require("../../utils/checkAuth");

const REQUESTS = {
	auth,
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
};

const PUBLIC = [
	{
		name: "auth",
		method: "post",
		path: "/auth",
		exec: [(req, res) => getApiRequest("auth", { req, res })],
	},
	{
		name: "createPassword",
		method: "post",
		path: "/createPassword",
		exec: [
			(req, res, next) => getApiRequest("createPassword", { req, res, next }),
			(req, res) => getApiRequest("auth", { req, res }),
		],
	},
	{
		name: "getDashboard",
		method: "get",
		path: "/getDashboard",
		exec: [
			checkAuth,
			(req, res) => getApiRequest("getDashboard", { req, res }),
		],
	},
	{
		name: "getModuleInfo",
		method: "get",
		path: "/getModuleInfo",
		exec: [
			checkAuth,
			checkModuleAccess,
			(req, res) => getApiRequest("getModuleInfo", { req, res }),
		],
	},
	{
		name: "getTask",
		method: "get",
		path: "/getTask",
		exec: [
			checkAuth,
			checkModuleAccess,
			(req, res) => getApiRequest("getTask", { req, res }),
		],
	},
	{
		name: "getModuleStart",
		method: "get",
		path: "/getModuleStart",
		exec: [
			checkAuth,
			checkModuleAccess,
			(req, res) => getApiRequest("getModuleStart", { req, res }),
		],
	},
	{
		name: "getModuleFinal",
		method: "get",
		path: "/getModuleFinal",
		exec: [
			checkAuth,
			checkModuleAccess,
			(req, res) => getApiRequest("getModuleFinal", { req, res }),
		],
	},
	{
		name: "getLessonStart",
		method: "get",
		path: "/getLessonStart",
		exec: [
			checkAuth,
			checkModuleAccess,
			(req, res) => getApiRequest("getLessonStart", { req, res }),
		],
	},
	{
		name: "getLessonFinal",
		method: "get",
		path: "/getLessonFinal",
		exec: [
			checkAuth,
			checkModuleAccess,
			(req, res) => getApiRequest("getLessonFinal", { req, res }),
		],
	},
	{
		name: "getLessonsList",
		method: "get",
		path: "/getLessonsList",
		exec: [
			checkAuth,
			checkModuleAccess,
			(req, res) => getApiRequest("getLessonsList", { req, res }),
		],
	},
	{
		name: "getTasksList",
		method: "get",
		path: "/getTasksList",
		exec: [
			checkAuth,
			checkModuleAccess,
			(req, res) => getApiRequest("getTasksList", { req, res }),
		],
	},
	{
		name: "getDiploma",
		method: "get",
		path: "/getDiploma",
		exec: [
			checkAuth,
			checkCertAccess,
			(req, res) => getApiRequest("getDiploma", { req, res }),
		],
	},
	{
		name: "setState",
		method: "post",
		path: "/setState",
		exec: [
			checkAuth,
			checkModuleAccess,
			(req, res) => getApiRequest("setState", { req, res }),
		],
	},
];

async function getApiRequest(type, { req, res, next }) {
	try {
		return REQUESTS[type]({ req, res, next });
	} catch (e) {
		log.warn(`Error in API method: ${type}.`, e);
		res.sendStatus(500);
		return;
	}
}

module.exports = { PUBLIC, getApiRequest };
