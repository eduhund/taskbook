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
		req.data = {};
		if (!wall || trustedMachines.includes(req.ip)) {
			next();
			return true;
		}

		const token = req?.headers?.accesstoken;
		const userId = checkToken(token)?.id;
		if (!userId) {
			next({ code: 10103 });
			return false;
		}

		req.data = {
			userId,
			isAuth: true,
			wall,
		};

		next();
		return true;
	};
}

module.exports = { checkAuth };
