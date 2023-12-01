const { log } = require("../../../services/logger/logger");
const { db } = require("../../dbRequests/mongo");

async function getCommentsList() {
  const stateArray = await db.STATE.find(
    { "comments.0": { $exists: true } },
    {
      projection: {
        _id: 0,
        data: 0,
      },
    }
  ).toArray();

  const commentList = [];
  for (const item of stateArray) {
    if (typeof item.comments[0] !== "string") {
      const userName = await db.USERS.findOne({ id: item.userId }).then(
        (result) => {
          return result.firstName + " " + result?.lastName;
        }
      );
      const taskInfo = await db.TASKS.findOne({ id: item.taskId }).then(
        (result) => {
          return {
            module: result?.module,
            lesson: result?.lesson,
            task: result?.name,
          };
        }
      );

      commentList.unshift({
        userId: item.userId,
        userName,
        module: taskInfo.module,
        lesson: taskInfo.lesson,
        task: taskInfo.task,
        taskId: item.taskId,
        message: item.comments[0]?.message,
        readedByTeacher: item?.comments[0]?.readedByTeacher || false,
      });
    }
  }

  return commentList;
}

module.exports.getCommentsList = getCommentsList;
