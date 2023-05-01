const {
	checkUser,
	checkCredentials,
	checkPayment,
	checkOTK,
	authUser,
	updatePass,
} = require("../../processes/processes");

const STUDENT = [
	{
		name: "auth",
		type: "post",
		params: ["email", "pass"],
		exec: [checkUser, checkCredentials, authUser],
	},
	{
		name: "checkPayment",
		type: "get",
		params: ["paymentId"],
		exec: [checkPayment, checkUser, authUser],
	},
	{
		name: "createPass",
		type: "post",
		params: ["email", "pass", "key"],
		exec: [checkOTK, updatePass, authUser],
	},
];

module.exports = { STUDENT };
