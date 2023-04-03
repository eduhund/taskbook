const { log } = require("../../../utils/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { generateMessage } = require("../../../utils/messageGenerator");
const { addUserAction } = require("../../../modules/statistics/addUserAction");

async function addComment({ req, res }) {
	const userId = req?.userId;
	const { taskId, comment, protest } = req.body;

	const query = { userId, taskId };
	const update = {
		ts: Date.now(),
		message: comment,
		protest,
		readedByTeacher: false,
	};

	try {
		await getDBRequest("setComment", {
			query,
			data: update,
			protest,
			returns: [],
		});
		const data = generateMessage(0, update);

		res.status(200).send(data);

		return data;
	} catch (e) {
		log.warn(`${taskId}: Error with processing new comment`);
		log.warn(e);
		const error = generateMessage(20115);
		res.status(400).send(error);
	} finally {
		addUserAction({
			userId,
			action: "addComment",
			data: { taskId, comment, protest },
			req,
		});
	}
}

module.exports.addComment = addComment;
