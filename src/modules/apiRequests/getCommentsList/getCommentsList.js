const { log } = require("../../../services/logger/logger");
const { USERS, TASKS, STATE } = require("../../dbRequests/mongo");
const { generateMessage } = require("../../../utils/messageGenerator");

async function getCommentsList({res}) {
  const stateArray = await STATE.find(
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
      const userName = await USERS.findOne({ id: item.userId }).then(
        (result) => {
          return result.firstName + " " + result?.lastName;
        }
      );
      const taskInfo = await TASKS.findOne({ id: item.taskId }).then(
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

  const data = generateMessage(0, commentList);
  res.status(200).send(data);
  
  return
}

module.exports = getCommentsList;
