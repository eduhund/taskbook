const { getFullTaskId, getFullQuestionId } = require("./idExtractor");
const { db } = require("../modules/dbRequests/mongo");

function getTaskName(taskId) {
  return db.TASKS.findOne({ id: taskId }).then((result) => {
    return [`Сделайте вначале задачу ${result?.name}`, false];
  });
}

function getParentContent(userId, contentId) {
  const taskId = getFullTaskId(contentId);
  return db.STATE.findOne({
    userId,
    taskId,
  }).then((result) => {
    if (result?.isChecked) {
      try {
        const questionId = getFullQuestionId(contentId);
        const parentContent = result.data?.[questionId]?.state;
        if (parentContent?.value) {
          return [parentContent?.value, true];
        } else {
          const selectedAnswers = parentContent
            .filter((item) => item.isSelected)
            .map((item) => item.label);
          return [selectedAnswers.join(", ") || "", true];
        }
      } catch {
        return [undefined, false];
      }
    } else return getTaskName(taskId);
  });
}

module.exports.getParentContent = getParentContent;
