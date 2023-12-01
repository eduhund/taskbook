const { log } = require("../../../services/logger/logger");
const { db } = require("../../dbRequests/mongo");

function changeCommentStatus({ userId, taskId, status }) {
  return db.STATE.findOneAndUpdate(
    { userId, taskId },
    {
      $set: {
        "comments.0.readedByTeacher": status,
      },
    },
    { upsert: true, returnDocument: "after", returnNewDocument: true }
  );
}

module.exports.changeCommentStatus = changeCommentStatus;
