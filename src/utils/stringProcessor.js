const { log } = require("../services/logger");

function lowerString(string) {
	try {
		const lowString = (string || "").toLowerCase();
		return lowString;
	} catch (e) {
		log.warn(e);
		return "";
	}
}

function upperString(string) {
	try {
		const upString = (string || "").toUpperCase();
		return upString;
	} catch (e) {
		log.warn(e);
		return "";
	}
}

module.exports = { lowerString, upperString };
