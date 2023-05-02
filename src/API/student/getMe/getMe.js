const { getUser } = require("../../../processes/processes");

async function getMe(req, res, next) {
	try {
		const { data } = req;

		const userExists = await getUser(data, next);
		if (!userExists) return;

		const content = data.user;
		delete content.pass;
		next({ code: 0, content });
	} catch {
		const err = { code: 20204 };
		next(err);
	}
}

module.exports = getMe;
