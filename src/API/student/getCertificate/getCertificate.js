const {
	getModuleInfo,
	getStateInfo,
	prepareCertificateData,
	getUserInfo,
} = require("@processes");

/***
 * getDiploma StudentAPI method.
 * https://api.eduhund.com/docs/student#getDiploma
 *
 * @since 0.6.0
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} Certificate data on success; undefined on fail
 */
async function getCertificate(req, res, next) {
	try {
		const { data } = req;

		const dataPromises = [getUserInfo(data), getModuleInfo(data)];

		const [userData, moduleData] = await Promise.all(dataPromises);
		if (!(userData && moduleData)) return;

		await getStateInfo(data);

		const content = await prepareCertificateData(data);

		next({ code: 0, content });
		return content;
	} catch (e) {
		const err = { code: 20210, trace: e };
		next(err);
		return;
	}
}

module.exports = getCertificate;
