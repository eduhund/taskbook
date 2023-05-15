const { createHash } = require("crypto");

function hashPass(pass) {
	return createHash("sha256").update(pass).digest("hex");
}

function checkPass(user, pass) {
	const validity = user?.pass === hashPass(pass) ? true : false;
	return validity;
}

module.exports.hashPass = hashPass;
module.exports.checkPass = checkPass;
