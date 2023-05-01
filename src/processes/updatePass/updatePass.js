const { log } = require("@logger");

const database = require("../../services/mongo/requests");

async function updatePass(req, res, next) {
	try {
		const { email, pass } = req.data;
		const user = await database("users", "setOne", {
			email,
			set: { pass },
		});

		if (!user) {
			throw new Error("User didn't found when was updating pass");
		}

		req.data.user = user;

		next();
	} catch (e) {
		log.error(e);
		const err = { code: 20205 };
		next(err);
		return err;
	}
}

module.exports = updatePass;
