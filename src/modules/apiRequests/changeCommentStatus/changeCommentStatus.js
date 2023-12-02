const { log } = require("../../../services/logger/logger");
const { db } = require("../../dbRequests/mongo");
const { generateMessage } = require("../../../utils/messageGenerator");

async function changeCommentStatus({ req, res }) {

  const {userId, taskId, status = false} = req.body

  try {
    await db.STATE.findOneAndUpdate(
      { userId, taskId },
      {
        $set: {
          "comments.0.readedByTeacher": status,
        },
      },
      { upsert: true, returnDocument: "after", returnNewDocument: true }
    );

		const data = generateMessage(0);
		res.status(200).send(data);

		return data;
	} catch (e) {
		log.warn(`Error with updating comment status for user ${userId} and task ${taskId}`);
		log.warn(e);
		const error = generateMessage(20115);
		res.status(400).send(error);
	}


}

module.exports.changeCommentStatus = changeCommentStatus;
