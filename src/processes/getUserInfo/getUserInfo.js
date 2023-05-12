const DB = require("@mongo/requests");

/***
 * Function provides main user info.
 *
 * @param {Object} data Throught API object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} User data on success; undefined in fail
 */
async function getUserInfo(data, next) {
	const { email, userId } = data;
	const query = { email, id: userId };
	Object.keys(query).forEach((key) => {
		if (!query[key]) {
			delete query[key];
		}
	});

	const user = await DB.getOne("users", {
		query,
	});

	if (!user) {
		next({ code: 10101 });
		return;
	}

	data.user = user;

	return user;
}

module.exports = getUserInfo;
