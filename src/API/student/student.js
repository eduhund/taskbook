const auth = require("./auth/auth");
const checkPayment = require("./checkPayment/checkPayment");
const createPass = require("./createPass/createPass");
const getMe = require("./getMe/getMe");
const getModule = require("./getModule/getModule");
const getLesson = require("./getLesson/getLesson");
const getTask = require("./getTask/getTask");
const setState = require("./setState/setState");
const addComment = require("./addComment/addComment");
const getCertificate = require("./getCertificate/getCertificate");
const getCounselor = require("./getCounselor/getCounselor");

const STUDENT = [
	{
		name: "auth",
		type: "post",
		requiredParams: ["email", "pass"],
		otherParams: ["lang"],
		exec: auth,
	},
	{
		name: "checkPayment",
		type: "get",
		requiredParams: ["paymentId"],
		exec: checkPayment,
	},
	{
		name: "createPass",
		type: "post",
		requiredParams: ["email", "pass", "key"],
		otherParams: ["lang"],
		exec: [createPass],
	},
	{
		name: "getMe",
		type: "get",
		wall: true,
		exec: getMe,
	},
	{
		name: "getModule",
		type: "get",
		wall: true,
		requiredParams: ["moduleId"],
		exec: [getModule],
	},
	{
		name: "getLesson",
		type: "get",
		wall: true,
		requiredParams: ["lessonId"],
		exec: [getLesson],
	},
	{
		name: "getTask",
		type: "get",
		wall: true,
		requiredParams: ["taskId"],
		exec: [getTask],
	},
	{
		name: "setState",
		type: "post",
		wall: true,
		requiredParams: ["taskId", "newState"],
		exec: [setState],
	},
	{
		name: "addComment",
		type: "post",
		wall: true,
		requiredParams: ["taskId", "comment"],
		exec: [addComment],
	},
	{
		name: "getCertificate",
		type: "get",
		wall: true,
		requiredParams: ["moduleId"],
		otherParams: ["isColor", "isMascot", "isResult", "isPublic"],
		exec: [getCertificate],
	},
	{
		name: "getCounselor",
		type: "get",
		requiredParams: ["lang"],
		exec: [getCounselor],
	},
];

module.exports = { STUDENT };
