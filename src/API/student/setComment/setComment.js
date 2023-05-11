const { pushComment } = require("../../../processes/processes");
const { checkAuth } = require("../../../services/express/security");

async function setState(req, res, next) {
	try {
		const isAuth = checkAuth(req, res, next);
		if (!isAuth) return;

		const { data } = req;

		const comments = await pushComment(data, next);

		next({ code: 0, content: comments });
	} catch (e) {
		const err = { code: 20209, trace: e };
		next(err);
	}
}

module.exports = setState;
