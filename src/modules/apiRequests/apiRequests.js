const { log } = require("../../utils/logger");

const { auth } = require("./auth/auth");
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
	auth,
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
		exec: (req, res) => getApiRequest("auth", req, res),
		middlewares: [],
	},
];

async function getApiRequest(type, req, res) {
	try {
		return REQUESTS[type](req, res);
	} catch (e) {
		log.warn(`Error in API method: ${type}.`, e);
		res.sendStatus(500);
		return;
	}
}

module.exports = { PUBLIC, getApiRequest };
