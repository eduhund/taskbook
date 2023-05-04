const auth = require("./auth/auth");
const checkPayment = require("./checkPayment/checkPayment");
const createPass = require("./createPass/createPass");
const getMe = require("./getMe/getMe");
const getModule = require("./getModule/getModule");
const getLesson = require("./getLesson/getLesson");
const getTask = require("./getTask/getTask");

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
		params: [],
		exec: getModule,
	},
	{
		name: "getLesson",
		type: "get",
		params: [],
		exec: getLesson,
	},
	{
		name: "getTask",
		type: "get",
		params: [],
		exec: getTask,
	},
];

module.exports = { STUDENT };
