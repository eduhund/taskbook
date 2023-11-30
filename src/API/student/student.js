const auth = require("./auth/auth");
const checkPayment = require("./checkPayment/checkPayment");
const createPass = require("./createPass/createPass");
const getMe = require("./getMe/getMe");
const getModule = require("./getModule/getModule");
const getLesson = require("./getLesson/getLesson");
const getTask = require("./getTask/getTask");
const setState = require("./setState/setState");
const addComment = require("./addComment/addComment");
const getCommentsList = require("./getCommentsList/getCommentsList");
const getCertificate = require("./getCertificate/getCertificate");
const getCounselor = require("./getCounselor/getCounselor");
const getModulesList = require("./getModulesList/getModulesList");
const requestOTK = require("./requestOTK/requestOTK");

const STUDENT = [
	{
		name: "auth",
		type: "post",
		requiredParams: ["type", "email", "pass"],
		otherParams: ["lang"],
		exec: auth,
	},
	{
		name: "requestOTK",
		type: "post",
		requiredParams: ["email"],
		otherParams: ["lang"],
		exec: requestOTK,
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
		name: "getCommentsList",
		type: "get",
		wall: true,
		requiredParams: ["taskId"],
		exec: [getCommentsList],
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
	{
		name: "getModulesList",
		type: "get",
		wall: true,
		exec: [getModulesList],
	},
];

module.exports = { STUDENT };
