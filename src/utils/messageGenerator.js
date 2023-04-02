const ERRORS = [
	{
		code: -1,
		type: "other_error",
	},
	{
		code: 10001,
		type: "invalid_request",
		description: "Missing required params",
	},
	{
		code: 10101,
		type: "invalid_credentials",
		description: "User didn't found",
	},
	{
		code: 10102,
		type: "invalid_credentials",
		description: "Invalid password",
	},
	{
		code: 10105,
		type: "invalid_credentials",
		description: "Verify key is invalid or expired",
	},
	{
		code: 10201,
		type: "access_denied",
		description: "You don't have access to this content",
	},
	{
		code: 10301,
		type: "not_found",
		description: "Task with this ID is not exist",
	},
	{
		code: 10302,
		type: "not_found",
		description: "Lesson with this ID is not exist",
	},
	{
		code: 10303,
		type: "not_found",
		description: "Module with this ID is not exist",
	},
	{
		code: 20101,
		type: "process_failure",
		description: "Password didn't set",
	},
];

function generateMessage(code, data = {}) {
	if (code === 0) {
		return { OK: true, data };
	} else {
		const error = ERRORS.find((error) => error.code === code) || -1;
		return { OK: false, error };
	}
}

module.exports = { generateMessage };
