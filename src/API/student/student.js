const { checkCredentials, authUser } = require("../../processes/processes");

const STUDENT = [
	{
		name: "auth",
		type: "post",
		params: ["email", "pass"],
		exec: [checkCredentials, authUser],
	},
];

module.exports = { STUDENT };
