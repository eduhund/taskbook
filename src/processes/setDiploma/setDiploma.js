const { log } = require("@logger");

const database = require("../../services/mongo/requests");

async function setDiploma(data) {
	console.log(data);
	const { query, params } = data;
	const update = await database("certs", "setOne", {
		query,
		set: params,
	});

	console.log(update);

	if (!update) {
		log.debug(`${query?.id}: A problem with setting diploma state!`);
		throw new Error();
	}

	return update;
}

module.exports = setDiploma;
