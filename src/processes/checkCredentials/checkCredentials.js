const { log } = require("@logger");

const { checkPass } = require("../../utils/pass");

async function checkCredentials(data, next) {
	const { user, pass } = data;
	if (!checkPass(user, pass)) {
		log.info(`${user.email}: Invalid password!`);
		next({ code: 10102 });
		return false;
	}

	return true;
}

module.exports = checkCredentials;
