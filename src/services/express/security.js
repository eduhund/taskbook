const { checkToken } = require("../../services/tokens/tokens");

function checkAuth(req, res, next) {
	const token = req?.headers?.accesstoken;
	const userId = checkToken(token)?.id;

	if (!userId) {
		next({ code: 10103 });
		return false;
	}

	req.data.userId = userId;
	return true;
}

module.exports = { checkAuth };
