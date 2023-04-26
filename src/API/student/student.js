const { checkParams } = require("../../processes/processes");

const STUDENT = [
	{
		name: "auth",
		type: "post",
		params: ["email", "pass"],
		exec: [checkParams],
	},
];

module.exports = STUDENT;
