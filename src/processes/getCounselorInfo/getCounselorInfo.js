const DB = require("../../services/mongo/requests");

/***
 * Function provides data for student counselor.
 *
 * @param {Object} data Throught API object
 *
 * @returns {Object} Counselor data
 */
async function getCounselorInfo(data) {
	const { lang } = data;
	const query = { lang };

	const counselor = await DB.getOne("counselor", {
		query,
	});

	if (!counselor) {
		throw new Error(`Can't find the counselor for language ${lang}`);
	}

	data.counselor = counselor;

	return counselor;
}

module.exports = getCounselorInfo;
