const { log } = require("@logger");

const DB = require("../../services/mongo/requests");

async function pushComment(data) {
	const { taskId, userId, comment } = data;

	const newComment = {
		ts: Date.now(),
		message: comment,
		readedByTeacher: false,
	};

	const update = await DB.setOne("state", {
		query: { taskId, userId },
		push: {
			comments: {
				$each: [newComment],
				$position: 0,
			},
		},
		returns: ["comments"],
	});

	if (!update) {
		log.debug(`${taskId}: A problem pushing new comment to DB!`);
		throw new Error();
	}

	return update;
}

module.exports = pushComment;
