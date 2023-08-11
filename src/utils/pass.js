const { createHash } = require("crypto");

function hashPass(pass = "") {
	return createHash("sha256").update(pass).digest("hex");
}

function checkPass(user = {}, pass = "") {
	if (typeof user.pass !== "undefined" && pass.length > 0)
		return user.pass === pass;
}

module.exports = { hashPass, checkPass };
