const auth = require("./auth/auth");
const checkPayment = require("./checkPayment/checkPayment");
const createPass = require("./createPass/createPass");
const getMe = require("./getMe/getMe");
const getModule = require("./getModule/getModule");
const getLesson = require("./getLesson/getLesson");
const getTask = require("./getTask/getTask");
const setState = require("./setState/setState");

const STUDENT = [
	{
		name: "auth",
		type: "post",
		params: ["email", "pass"],
		exec: auth,
	},
	{
		name: "checkPayment",
		type: "get",
		params: ["paymentId"],
		exec: checkPayment,
	},
	{
		name: "createPass",
		type: "post",
		params: ["email", "pass", "key"],
		exec: createPass,
	},
	{
		name: "getMe",
		type: "get",
		params: [],
		exec: getMe,
	},
	{
		name: "getModule",
		type: "get",
		params: ["moduleId"],
		exec: getModule,
	},
	{
		name: "getLesson",
		type: "get",
		params: ["lessonId"],
		exec: getLesson,
	},
	{
		name: "getTask",
		type: "get",
		params: ["taskId"],
		exec: getTask,
	},
	{
		name: "setState",
		type: "post",
		params: ["userId", "taskId", "newState"],
		exec: setState,
	},
];

module.exports = { STUDENT };
