const { getCounselorInfo } = require("../../../processes/processes");

async function getCounselor(req, res, next) {
	try {
		const { data } = req;

		const content = await getCounselorInfo(data);

		next({ code: 0, content });
	} catch {
		const err = { code: 20210 };
		next(err);
	}
}

module.exports = getCounselor;
