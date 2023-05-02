const { checkToken } = require("../../services/tokens/tokens");

function checkAuth(req, res, next) {
	const { path } = req;
	const externalRequests = ["auth", "checkPayment", "createPass"];

	if (externalRequests.find((request) => path === `/v3/student/${request}`)) {
		next();
		return;
	}

	const token = req?.headers?.accesstoken;
	const userId = checkToken(token)?.id;

	if (!userId) {
		next({ code: 10103 });
		return;
	}

	req.data.userId = userId;
	next();
}

module.exports = { checkAuth };
