const {
	getModuleInfo,
	getStateInfo,
	prepareData,
	getUser,
} = require("../../../processes/processes");
const { checkAuth } = require("../../../services/express/security");

async function getDiploma(req, res, next) {
	try {
		const isAuth = checkAuth(req, res, next);
		if (!isAuth) return;

		const { data } = req;

		const dataPromises = [getUser(data, next), getModuleInfo(data, next)];

		const [userData, moduleData] = await Promise.all(dataPromises);
		if (!(userData && moduleData)) return;

		await getStateInfo(data);

		const content = await prepareData("diploma", data, isAuth, next);

		next({ code: 0, content });
	} catch (e) {
		const err = { code: 20210, trace: e };
		next(err);
	}
}

module.exports = getDiploma;
