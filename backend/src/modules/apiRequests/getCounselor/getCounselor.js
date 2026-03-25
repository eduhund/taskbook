const { getDBRequest } = require("../../dbRequests/dbRequests");
const { generateMessage } = require("../../../utils/messageGenerator");

async function getCounselor(req, res) {
	const { lang = "en" } = req?.query;

		const response = await getDBRequest("getCounselor", { query: { lang } });
		if (!response) {
			throw new Error("Selected language is not exist");
		}

		const data = generateMessage(0, response.pages);
		res.status(200).send(data);

		return;

}

module.exports = getCounselor;
