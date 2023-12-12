const { log } = require("@logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { generateMessage } = require("../../../utils/messageGenerator");
const { sendMessage } = require("../../../services/assistant/assistant");

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

	const {email, firstName, lastName} = await getDBRequest("getUserInfo", {
		query: { id: userId },
		returns: ["email", "firstName", "lastName"],
	})

	const { name } = await getDBRequest("getTaskInfo", {
		query: { id: taskId },
		returns: ["name"]
	})

	const messageData = {
		type: "taskComment",
    data: {
        email,
        firstName,
				lastName,
        taskId: taskId,
        taskName: name
    },
    text: comment
	}

	sendMessage(messageData)

	log.info(`New comment from user ${userId}: ${comment}`);

	return;
}

module.exports = addComment;
