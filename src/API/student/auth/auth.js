const {
	checkUser,
	checkCredentials,
	authUser,
} = require("../../../processes/processes");

async function auth(req, res, next) {
	try {
		const { data } = req;

		const userExists = await checkUser(data, next);
		if (!userExists) return;

		const credentialsValid = await checkCredentials(data, next);
		if (!credentialsValid) return;

		const content = await authUser(data);
		next({ code: 0, content });
	} catch {
		const err = { code: 20201 };
		next(err);
	}
}

module.exports = auth;
