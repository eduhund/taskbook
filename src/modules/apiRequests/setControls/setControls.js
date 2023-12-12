const { log } = require("@logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { generateMessage } = require("../../../utils/messageGenerator");

async function setControls(req, res) {
	const userId = req?.userId;
	const { taskId, controlsState } = req.body;

	const query = { userId, taskId };
	await getDBRequest("setControls", {
		query,
		controlsState,
		returns: [],
	});
	
	const data = generateMessage(0);
	res.status(200).send(data);

	return;
}

module.exports = setControls;
