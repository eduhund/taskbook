const {
	getModuleInfo,
	getStateInfo,
	prepareData,
} = require("../../../processes/processes");
const { checkAuth } = require("../../../services/express/security");

async function getModule(req, res, next) {
	try {
		const isAuth = checkAuth(req, res, next);

		const { data } = req;

		const moduleData = await getModuleInfo(data, next);
		if (!moduleData) return;

		isAuth && (await getStateInfo(data));

		const content = await prepareData("module", data, isAuth);

		next({ code: 0, content });
	} catch (e) {
		const err = { code: 20205, trace: e };
		next(err);
	}
}

module.exports = getModule;
