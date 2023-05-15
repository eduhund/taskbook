const DB = require("@mongo/requests");

const DEMO = process.env.DEMO;

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

	if (moduleId) {
		const query = { code: moduleId };
		const moduleData = await DB.getOne("modules", { query });
		if (!moduleData) {
			next({ code: 10301 });
			return false;
		}
		data.module = moduleData;
		return moduleData;
	} else {
		const modulesList = await DB.getMany("modules", {
			query: DEMO ? {} : { active: true },
		});
		data.modulesList = modulesList;
		return modulesList;
	}
}

module.exports = getModuleInfo;
