const { getCounselorInfo } = require("@processes");

/***
 * getCounselor StudentAPI method.
 * https://api.eduhund.com/docs/student#getCounselor
 *
 * @since 0.6.0
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} Counselor data on success; undefined on fail
 */
async function getCounselor(req, res, next) {
	try {
		const { data } = req;

		const content = await getCounselorInfo(data);

		next({ code: 0, content });
		return content;
	} catch (e) {
		const err = { code: 20211, trace: e };
		next(err);
	}
}

module.exports = getCounselor;
