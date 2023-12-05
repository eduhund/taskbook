const { log } = require("@logger");

const { auth } = require("./auth/auth");
const { checkPayment } = require("./checkPayment/checkPayment");
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


const resetPassword = require("./resetPassword/resetPassword");
const createUser = require("./createUser/createUser");
const updateUser = require("./updateUser/updateUser");
const getStudentsList = require("./getStudentsList/getStudentsList");
const { getModulesList } = require("./getModulesList/getModulesList");
const {
	changeCommentStatus,
} = require("./changeCommentStatus/changeCommentStatus");
const { getCommentsList } = require("./getCommentsList/getCommentsList");
const newPayment = require("./newPayment/newPayment");

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
};

const PUBLIC = [
	{
		name: "auth",
		method: "post",
		path: "/auth",
		exec: [(req, res) => getApiRequest("auth", { req, res })],
	},
	{
		name: "checkPayment",
		method: "post",
		path: "/checkPayment",
		exec: [(req, res) => getApiRequest("checkPayment", { req, res })],
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
			checkCertAccess,
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
			checkCertAccess,
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
			checkCertAccess,
			(req, res) => getApiRequest("getLessonsList", { req, res }),
		],
	},
	{
		name: "getTasksList",
		method: "get",
		path: "/getTasksList",
		exec: [
			checkAuth,
			checkCertAccess,
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
	{
		name: "checkTask",
		method: "post",
		path: "/checkTask",
		exec: [
			checkAuth,
			checkModuleAccess,
			(req, res) => getApiRequest("checkTask", { req, res }),
		],
	},
	{
		name: "setControls",
		method: "post",
		path: "/setControls",
		exec: [
			checkAuth,
			checkModuleAccess,
			(req, res) => getApiRequest("setControls", { req, res }),
		],
	},
	{
		name: "addComment",
		method: "post",
		path: "/addComment",
		exec: [
			checkAuth,
			checkModuleAccess,
			(req, res) => getApiRequest("addComment", { req, res }),
		],
	},
	{
		name: "getCounselor",
		method: "get",
		path: "/getCounselor",
		exec: [
			checkAuth,
			(req, res) => getApiRequest("getCounselor", { req, res }),
		],
	},
];

const TEACHER = [
	{
		name: "createUser",
		method: "post",
		path: "/createUser",
		exec: [(req, res) => getApiRequest("createUser", { req, res })],
	},
	{
		name: "resetPassword",
		method: "post",
		path: "/resetPassword",
		exec: [(req, res) => getApiRequest("resetPassword", { req, res })],
	},
	{
		name: "updateUser",
		method: "post",
		path: "/updateUser",
		exec: [(req, res) => getApiRequest("updateUser", { req, res })],
	},
	{
		name: "getStudentsList",
		method: "get",
		path: "/getStudentsList",
		exec: [(req, res) => getApiRequest("getStudentsList", { req, res })],
	},
	{
		name: "getModulesList",
		method: "get",
		path: "/getModulesList",
		exec: [(req, res) => getApiRequest("getModulesList", { req, res })],
	},
	{
		name: "getCommentsList",
		method: "get",
		path: "/getCommentsList",
		exec: [(req, res) => getApiRequest("getCommentsList", { req, res })],
	},
	{
		name: "changeCommentStatus",
		method: "post",
		path: "/changeCommentStatus",
		exec: [(req, res) => getApiRequest("changeCommentStatus", { req, res })],
	},
	{
		name: "newPayment",
		method: "post",
		path: "/newPayment",
		exec: [(req, res) => getApiRequest("newPayment", { req, res })],
	},
]

async function getApiRequest(type, { req, res, next }) {
	try {
		return REQUESTS[type]({ req, res, next });
	} catch (e) {
		log.warn(`Error in API method: ${type}.`, e);
		res.sendStatus(500);
		return;
	}
}

module.exports = { PUBLIC, TEACHER, getApiRequest };
