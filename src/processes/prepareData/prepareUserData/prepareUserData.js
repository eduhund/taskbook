/***
 * Function prepares user data to send to user.
 *
 * @param {Object} data Throught API object
 *
 * @returns {Object} User content
 */
function prepareUserData(data) {
	const { user, isAuth } = data;
	user.modules = Object.keys(user.modules || []);
	if (isAuth) {
		delete user.token;
	}
	delete user.pass;

	return user;
}

module.exports = prepareUserData;
