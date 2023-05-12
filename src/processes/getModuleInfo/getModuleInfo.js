const DB = require("@mongo/requests");

/***
 * Function provides module's main data.
 *
 * @param {Object} data Throught API object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} Lesson's data on success; undefined on fail
 */
async function getModuleInfo(data, next) {
	const { moduleId } = data;
	const query = { code: moduleId };

	const moduleData = await DB.getOne("modules", { query });

	if (!moduleData) {
		next({ code: 10301 });
		return false;
	}

	data.module = moduleData;

	return moduleData;
}

module.exports = getModuleInfo;
