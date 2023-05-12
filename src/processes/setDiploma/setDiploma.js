const DB = require("@mongo/requests");

/***
 * Function set new sertificate params.
 *
 * @param {Object} data Throught API object
 *
 * @returns {Object} New sertificate state
 */
async function setDiploma(data) {
	const { query, params } = data;
	const update = await DB.setOne("certs", {
		query,
		set: params,
	});

	if (!update) {
		throw new Error(`${query?.id}: A problem with setting diploma state!`);
	}

	return update;
}

module.exports = setDiploma;
