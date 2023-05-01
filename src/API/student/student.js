const {
	checkCredentials,
	checkPayment,
	authUser,
} = require("../../processes/processes");

const STUDENT = [
	{
		name: "auth",
		type: "post",
		params: ["email", "pass"],
		exec: [checkCredentials, authUser],
	},
	{
		name: "checkPayment",
		type: "get",
		params: ["paymentId"],
		exec: [checkPayment, authUser],
	},
];

module.exports = { STUDENT };
