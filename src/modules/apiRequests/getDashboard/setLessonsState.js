function setLessonsState(lessons, nextTaskId) {
  const lessonsState = Object.keys(lessons).map((lessonId, i) => {
    return {
      id: lessonId,
      name: i + 1,
      status: "future",
    };
  });

  const currentLessonId = nextTaskId.substring(3, 5);

  const currentLessonIndex = Object.keys(lessons).indexOf(currentLessonId);

  for (let i = 0; i < currentLessonIndex; i++) {
    lessonsState[i].status = "past";
  }
  lessonsState[currentLessonIndex].status = "current";

  return lessonsState;
}

module.exports.setLessonsState = setLessonsState;
