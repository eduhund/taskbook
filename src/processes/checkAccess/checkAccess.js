const { getModuleId } = require("@utils/idExtractor");
const { calculateDeadline } = require("@utils/calculators");

function checkDate(start, deadline) {
	if (!start && !deadline) return false;
	const today = Date.now();
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
	const deadline = calculateDeadline(user?.modules?.[cutModuleId] || {});

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
	const { user, moduleId, module } = data;
	const modules = Object.keys(user?.modules);
	const isFinalAccess = modules.includes(moduleId || module.code);
	data.isFinalAccess = isFinalAccess;
	return isFinalAccess;
}

module.exports = { checkModuleAccess, checkFinalAccess };
