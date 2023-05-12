const DB = require("@mongo/requests");
const { setToken } = require("@tokenMachine/tokenMachine");

/***
 * Function provides user's access token.
 * If user pushed to request a UI language, change it too.
 *
 * @param {Object} data Throught API object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object} User data on success
 */
async function authUser(data) {
	const { lang, user } = data;

	user.token = setToken(user);

	if (lang && lang !== user.lang) {
		await DB.setOne("users", {
			query: { email: user.email },
			set: { lang },
		});
		user.lang = lang;
	}

	return user;
}

module.exports = authUser;
