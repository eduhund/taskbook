const auth = require("./auth/auth");
const checkPayment = require("./checkPayment/checkPayment");
const createPass = require("./createPass/createPass");
const getMe = require("./getMe/getMe");
const getModule = require("./getModule/getModule");
const getLesson = require("./getLesson/getLesson");
const getTask = require("./getTask/getTask");
const setState = require("./setState/setState");
const setComment = require("./setComment/setComment");
const getDiploma = require("./getDiploma/getDiploma");
const getCounselor = require("./getCounselor/getCounselor");

const STUDENT = [
	{
		name: "auth",
		type: "post",
		params: ["email", "pass"],
		exec: [auth],
	},
	{
		name: "checkPayment",
		type: "get",
		params: ["paymentId"],
		exec: [checkPayment],
	},
	{
		name: "createPass",
		type: "post",
		params: ["email", "pass", "key"],
		exec: [createPass],
	},
	{
		name: "getMe",
		type: "get",
		wall: true,
		params: [],
		exec: [getMe],
	},
	{
		name: "getModule",
		type: "get",
		params: ["moduleId"],
		exec: [getModule],
	},
	{
		name: "getLesson",
		type: "get",
		wall: true,
		params: ["lessonId"],
		exec: [getLesson],
	},
	{
		name: "getTask",
		type: "get",
		wall: true,
		params: ["taskId"],
		exec: [getTask],
	},
	{
		name: "setState",
		type: "post",
		wall: true,
		params: ["taskId", "newState"],
		exec: [setState],
	},
	{
		name: "setComment",
		type: "post",
		wall: true,
		params: ["taskId", "comment"],
		exec: [setComment],
	},
	{
		name: "getDiploma",
		type: "get",
		wall: true,
		params: ["moduleId"],
		exec: [getDiploma],
	},
	{
		name: "getCounselor",
		type: "get",
		params: ["lang"],
		exec: [getCounselor],
	},
];

module.exports = { STUDENT };
