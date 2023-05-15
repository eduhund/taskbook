const { checkKey } = require("@tokenMachine/OTK");

/***
 * Function checks one-time key for password change.
 *
 * @param {Object} data Throught API object
 * @param {Function} next Express middleware next function
 *
 * @returns {boolean} Check result
 */
async function checkOTK(data, next) {
	const { key } = data;

	const verify = await checkKey(key);
	if (!verify) {
		next({ code: 10105 });
		return false;
	}
	return true;
}

module.exports = checkOTK;
