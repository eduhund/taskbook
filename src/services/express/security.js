const { checkToken } = require("../tokenMachine/tokenMachine");

const trustedMachines = process.env.TRUSTED || [];

/***
 * Function checks user access token.
 *
 * @param {boolean} wall Is requested method behind the wall
 *
 * @returns {boolean} Result of auth checking
 */
function checkAuth(wall) {
	return (req, res, next) => {
		if (!wall || trustedMachines.includes(req.ip)) {
			next();
			return false;
		}
		const token = req?.headers?.accesstoken;
		const userId = checkToken(token)?.id;
		if (!userId) {
			next({ code: 10103 });
			return false;
		}

		req.data.userId = userId;
		req.data.isAuth = true;
		next();
		return true;
	};
}

module.exports = { checkAuth };
