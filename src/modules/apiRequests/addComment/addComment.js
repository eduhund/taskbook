const { log } = require("@logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { generateMessage } = require("../../../utils/messageGenerator");

async function addComment(req, res) {
	const { userId } = req;
	const { taskId, comment, protest } = req.body;

	const query = { userId, taskId };
	const update = {
		ts: Date.now(),
		message: comment,
		protest,
		readedByTeacher: false,
	};

	await getDBRequest("setComment", {
		query,
		data: update,
		protest,
		returns: [],
	});

	const data = generateMessage(0, update);
	res.status(200).send(data);

	log.info(`New comment from user ${userId}: ${comment}`);

	return;
}

module.exports = addComment;
