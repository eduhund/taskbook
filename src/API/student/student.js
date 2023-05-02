const auth = require("./auth/auth");
const checkPayment = require("./checkPayment/checkPayment");
const createPass = require("./createPass/createPass");

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
	/*
	{
		name: "getMe",
		type: "get",
		params: [],
		exec: [getUser],
	},
	*/
];

module.exports = { STUDENT };
