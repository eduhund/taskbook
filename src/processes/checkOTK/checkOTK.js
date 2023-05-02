const { log } = require("@logger");

const { checkKey } = require("../../services/otk/requests");

async function checkOTK(data, next) {
	const { key } = data;

	const verify = await checkKey(key);
	if (!verify) {
		log.debug(`${key}: OTK didn't found!`);
		next({ code: 10105 });
		return false;
	}
	return true;
}

module.exports = checkOTK;
