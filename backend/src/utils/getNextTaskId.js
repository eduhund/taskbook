function getNextTaskId(moduleData, moduleState) {
  moduleState.sort(function (a, b) {
    const taskA = a.taskId.toLowerCase(),
      taskB = b.taskId.toLowerCase();
    if (taskA > taskB) return -1;
    if (taskA < taskB) return 1;
    return 0;
  });
  const currentTaskId = moduleState[0]?.taskId;

  let nextTaskId;
  if (currentTaskId) {
    const currentLessonId = currentTaskId.substring(3, 5);
    const currentLesson = moduleData.lessons[currentLessonId];
    const currentLessonIndex = Object.keys(moduleData.lessons).indexOf(
      currentLessonId
    );
    const currentTaskIndex = currentLesson.tasks.indexOf(currentTaskId);

    if (currentTaskIndex < currentLesson.tasks.length - 1) {
      nextTaskId = currentLesson.tasks[currentTaskIndex + 1];
    } else if (
      currentTaskIndex == currentLesson.tasks.length - 1 &&
      currentLessonIndex > Object.keys(moduleData.lessons).length - 1
    ) {
      const nextLessonId = Object.keys(moduleData.lessons)[
        currentLessonIndex + 1
      ];
      nextTaskId = moduleData.lessons[nextLessonId].tasks[0];
    } else {
      nextTaskId = currentTaskId;
    }
  } else {
    nextTaskId = `${moduleData.code}0101`;
  }

  return nextTaskId;
}

module.exports.getNextTaskId = getNextTaskId;
