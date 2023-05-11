const { log } = require("@logger");

const DB = require("../../services/mongo/requests");

async function setDiploma(data) {
	const { query, params } = data;
	const update = await DB.setOne("certs", {
		query,
		set: params,
	});

	if (!update) {
		log.debug(`${query?.id}: A problem with setting diploma state!`);
		throw new Error();
	}

	return update;
}

module.exports = setDiploma;
