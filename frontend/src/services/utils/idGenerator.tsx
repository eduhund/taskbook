function getModuleId({ module }: any) {
	if (!module) return undefined;
	return module.toUpperCase();
}

function getLessonId({ lesson }: any) {
	if (!lesson) return undefined;
	return lesson.toString().padStart(2, "0");
}

function getTaskId({ task }: any) {
	if (!task) return undefined;
	return task.toString().padStart(2, "0");
}

function getFullTaskId({ module, lesson, task }: any) {
	if (!module || !lesson || !task) return "";
	const moduleId = getModuleId({ module });
	const lessonId = getLessonId({ lesson });
	const taskId = getTaskId({ task });
	return `${moduleId}${lessonId}${taskId}`;
}

export { getModuleId, getLessonId, getTaskId, getFullTaskId };
