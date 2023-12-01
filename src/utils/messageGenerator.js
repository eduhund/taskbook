const ERRORS = [
	{
		code: -1,
		type: "other_error",
	},
	{
		code: 10001,
		type: "invalid_request",
		description: "Invalid path",
	},
	{
		code: 10002,
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
		code: 10103,
		type: "invalid_credentials",
		description: "Verify key is invalid or expired",
	},
	{
		code: 10104,
		type: "invalid_credentials",
		description: "Payment didn't found",
	},
	{
		code: 10105,
		type: "invalid_credentials",
		description: "Access token is invalid or expired",
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
	{
		code: 20102,
		type: "process_failure",
		description: "Error while preparing task data",
	},
	{
		code: 20103,
		type: "process_failure",
		description: "Error while preparing module start data",
	},
	{
		code: 20104,
		type: "process_failure",
		description: "Error while preparing module final data",
	},
	{
		code: 20105,
		type: "process_failure",
		description: "Error while preparing lesson start data",
	},
	{
		code: 20106,
		type: "process_failure",
		description: "Error while preparing lesson final data",
	},
	{
		code: 20107,
		type: "process_failure",
		description: "Error while preparing dashboard data",
	},
	{
		code: 20108,
		type: "process_failure",
		description: "Error while preparing lessons list",
	},
	{
		code: 20109,
		type: "process_failure",
		description: "Error while preparing tasks list",
	},
	{
		code: 20110,
		type: "process_failure",
		description: "Error while preparing module info",
	},
	{
		code: 20111,
		type: "process_failure",
		description: "Error while preparing diploma",
	},
	{
		code: 20112,
		type: "process_failure",
		description: "Error while setting new question state",
	},
	{
		code: 20113,
		type: "process_failure",
		description: "Error while task was checking",
	},
	{
		code: 20114,
		type: "process_failure",
		description: "Error while updating task's controls state",
	},
	{
		code: 20115,
		type: "process_failure",
		description: "Error with processing new comment",
	},
	{
		code: 20116,
		type: "process_failure",
		description: "Error with getting counselor content",
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
