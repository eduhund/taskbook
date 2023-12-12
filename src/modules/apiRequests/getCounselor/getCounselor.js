const { log } = require("@logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { generateMessage } = require("../../../utils/messageGenerator");

async function getCounselor(req, res) {
	const userId = req?.userId;
	const { lang = "en" } = req?.query;

		const response = await getDBRequest("getCounselor", { query: { lang } });
		if (!response) {
			throw new Error("Selected language is not exist");
		}

		const data = generateMessage(0, response.pages);
		res.status(200).send(data);

		log.info(`User ${userId} is watching the counselor`);

		return;

}

module.exports = getCounselor;
