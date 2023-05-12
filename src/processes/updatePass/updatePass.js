const DB = require("@mongo/requests");

/***
 * Function set new password for user.
 *
 * @param {Object} data Throught API object
 *
 * @returns {Object} User data
 */
async function updatePass(data) {
	const { email, pass } = data;
	const user = await DB.setOne("users", {
		query: { email },
		set: { pass },
	});

	if (!user) {
		throw new Error(`${email}: User didn't found when pass updating !`);
	}

	data.user = user;

	return user;
}

module.exports = updatePass;
