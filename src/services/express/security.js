const { checkToken } = require("../tokenMachine/tokenMachine");

const trustedMachines = process.env.TRUSTED || [];

function checkAuth(wall) {
	return (req, res, next) => {
		if (!wall || trustedMachines.includes(req.ip)) {
			next();
			return;
		}
		const token = req?.headers?.accesstoken;
		const userId = checkToken(token)?.id;

		if (!userId) {
			next({ code: 10103 });
		}

		req.data.userId = userId;
		next();
	};
}

module.exports = { checkAuth };
