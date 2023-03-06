const { db } = require("../modules/dbRequests/mongo");
const { getFullTaskId, getFullQuestionId } = require("./idExtractor");

function setVisibility(userId, id, childId) {
  const idLength = id.length;
  const taskId = getFullTaskId(id);
  const questionId = getFullQuestionId(id);
  const path = "data." + childId + ".isVisible";
  return db.STATE.findOne({
    userId,
    taskId,
  }).then(async (result) => {
    let isVisible;
    switch (idLength) {
      case 13:
        const answer = (result?.data?.[questionId]?.state || []).find(
          (answer) => answer.id == id
        );
        if (answer?.isSelected && result?.data?.[questionId]?.isVisible)
          isVisible = true;
        else isVisible = false;
        break;
      case 11:
        if (result?.data?.[questionId] && result?.data?.[questionId]?.isVisible)
          isVisible = true;
        else isVisible = false;
        break;
    }
    await db.STATE.findOneAndUpdate(
      { userId, taskId },
      {
        $set: {
          [path]: isVisible,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        returnNewDocument: true,
        projection: { _id: 0 },
      }
    );
    return isVisible;
  });
}

module.exports.setVisibility = setVisibility;
