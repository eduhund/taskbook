const { log } = require("../../../services/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { generateMessage } = require("../../../utils/messageGenerator");
const { addUserAction } = require("../../../modules/statistics/addUserAction");

async function setControls({ req, res }) {
	const userId = req?.userId;
	const { taskId, controlsState } = req.body;

	try {
		const query = { userId, taskId };
		await getDBRequest("setControls", {
			query,
			controlsState,
			returns: [],
		});
		const data = generateMessage(0);

		res.status(200).send(data);

		return data;
	} catch (e) {
		log.warn(`${taskId}: Error while updating task's controls state`);
		log.warn(e);
		const error = generateMessage(20114);
		res.status(400).send(error);
	} finally {
		addUserAction({
			userId,
			action: "setControls",
			data: { taskId, controlsState },
			req,
		});
	}
}

module.exports.setControls = setControls;
