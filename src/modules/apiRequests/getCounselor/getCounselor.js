const { log } = require("../../../utils/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { generateMessage } = require("../../../utils/messageGenerator");
const { addUserAction } = require("../../../modules/statistics/addUserAction");

async function getCounselor({ req, res }) {
	const userId = req?.userId;
	try {
		const response = await getDBRequest("getCounselor", { lang: "ru" });
		const data = generateMessage(0, response);

		res.status(200).send(data);

		return data;
	} catch (e) {
		log.warn(`${userId}: Error with getting counselor content`);
		log.warn(e);
		const error = generateMessage(20105);
		res.status(400).send(error);
	} finally {
		addUserAction({
			userId,
			action: "getCounselor",
			data: { userId },
			req,
		});
	}
}

module.exports.getCounselor = getCounselor;
