const { checkToken } = require("../tokenMachine/tokenMachine");

const trustedMachines = process.env.TRUSTED || [];
const adminToken = process.env.ADMIN_TOKEN

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

		const isTrustedMachine = trustedMachines.includes(req.ip);

		if (wall && isTrustedMachine) {
			req.data = {
				isAuth: true,
			};
		}

		if (wall && !isTrustedMachine) {
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
		}

		next();
		return true;
	};
}

function checkAdmin(req, res, next) {
	if (Object.keys(req.body).includes("gumroad_fee")) {
		next();
		return;
	}
	const token = req?.headers?.accesstoken;

	if (token !== adminToken) {
		res.status(401);
		res.send({
			OK: false,
			error: "invalid_credentials",
			error_description: "Invalid access token",
			error_code: 10003,
		});
		return;
	} else {
		next();
	}
}

module.exports = { checkAuth, checkAdmin };
