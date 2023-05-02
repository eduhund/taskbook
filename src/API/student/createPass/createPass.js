const {
	checkOTK,
	updatePass,
	authUser,
} = require("../../../processes/processes");

async function createPass(req, res, next) {
	try {
		const { data } = req;

		const OTKIsValid = await checkOTK(data, next);
		if (!OTKIsValid) return;

		await updatePass(data, next);

		const content = await authUser(data);
		next({ code: 0, content });
	} catch {
		const err = { code: 20202 };
		next(err);
	}
}

module.exports = createPass;
