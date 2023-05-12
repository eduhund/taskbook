const { checkPass } = require("@utils/pass");

/***
 * Function checks user's credentials.
 *
 * @param {Object} data Throught API object
 * @param {Function} next Express middleware next function
 *
 * @returns {boolean} Check result
 */
async function checkCredentials(data, next) {
	const { user, pass } = data;
	const isPassValid = checkPass(user, pass);

	if (isPassValid) {
		next({ code: 10102 });
		return false;
	}

	return true;
}

module.exports = checkCredentials;
