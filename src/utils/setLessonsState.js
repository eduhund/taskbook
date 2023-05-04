const { getLessonId } = require("../utils/idExtractor");

function setLessonsState(lessons = {}, nextTaskId) {
	const lessonsState = Object.entries(lessons).map(([id, value]) => {
		return {
			id,
			title: value?.title,
			description: value?.description,
			status: "future",
		};
	});

	console.log(lessonsState);

	const currentLessonId = getLessonId(nextTaskId);

	const currentLessonIndex = Object.keys(lessons).indexOf(currentLessonId);

	for (let i = 0; i < currentLessonIndex; i++) {
		lessonsState[i].status = "past";
	}
	lessonsState[currentLessonIndex].status = "current";

	return lessonsState;
}

module.exports = setLessonsState;
