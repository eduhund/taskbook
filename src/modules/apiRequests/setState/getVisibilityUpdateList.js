function getVisibilityUpdateList(tasks, questionId) {
  // Get array with question, whith visibility need to change
  const list = [];
  try {
    tasks.forEach((task) => {
      task?.content.forEach((contentItem) => {
        contentItem?.questions.forEach((question) => {
          (question?.depends || []).forEach((item) => {
            if (
              item.type == "visibility" &&
              item.parentId.includes(questionId)
            ) {
              switch (item.parentId.length) {
                case 13:
                  list.push({
                    type: "variant",
                    targetTaskId: task.id,
                    questionId: question.id,
                    variantId: item.parentId,
                  });
                  break;
                case 11:
                  list.push({
                    type: "question",
                    targetTaskId: task.id,
                    questionId: question.id,
                  });
                  break;
              }
            }
          });
        });
      });
    });
  } catch {
    log.warn("Error with combine task list, nedded to update");
  }
  return list;
}

module.exports.getVisibilityUpdateList = getVisibilityUpdateList;
