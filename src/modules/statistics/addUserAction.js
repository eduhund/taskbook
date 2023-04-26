const { log } = require("@logger");
const { getDBRequest } = require("../dbRequests/dbRequests");

async function addUserAction({
	userId = "U0000000",
	action = "default",
	data = {},
	req = {},
}) {
	const params = {};
	try {
		await getDBRequest("addUserAction", {
			userId,
			action,
			data,
			params,
		});
	} catch (e) {
		log.warn(e);
	}
}

module.exports.addUserAction = addUserAction;
