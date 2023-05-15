const { getModuleId } = require("@utils/idExtractor");

function checkDate(start, deadline) {
	if (!start && !deadline) return false;
	const today = Date.now();
	console.log(today >= Date.parse(start) && today < Date.parse(deadline));
	return today >= Date.parse(start) && today < Date.parse(deadline);
}

/**
 * Check student access to the module data
 *
 * @param {Object} data Throught API object
 *
 * @returns {boolean} Check result
 */
function checkModuleAccess(data) {
	const { user, moduleId, lessonId, taskId, questionId } = data;

	const cutModuleId = moduleId || getModuleId(lessonId || taskId || questionId);

	const startDate = user?.modules?.[cutModuleId]?.start;
	const deadline = user?.modules?.[cutModuleId]?.deadline;

	return checkDate(startDate, deadline);
}

/**
 * Checks student access to the module final page and the certificate
 *
 * @param {Object} data Throught API object
 *
 * @returns {boolean} Check result
 */
function checkFinalAccess(data) {
	const { user, moduleId } = data;

	const modules = Object.keys(user?.modules);
	return modules.includes(moduleId);
}

module.exports = { checkModuleAccess, checkFinalAccess };
