const { log } = require("../../../services/logger/logger");
const { STATE } = require("../../dbRequests/mongo");
const { generateMessage } = require("../../../utils/messageGenerator");

async function changeCommentStatus(req, res) {

  const {userId, taskId, status = false} = req.body

  await STATE.findOneAndUpdate(
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

  return
}

module.exports = changeCommentStatus;
