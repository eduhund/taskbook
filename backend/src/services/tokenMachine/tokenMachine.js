const { readFile, writeFile } = require("../../services/fs/fs")

function rand() {
	return Math.random().toString(36).substring(2);
}

function getToken() {
	const accessToken = rand() + rand();
	const refreshToken = rand();
	const expiresAt = Date.now() + 5 * 24 * 60 * 60 * 1000;
	return {
		accessToken,
		expiresAt,
		refreshToken,
	};
}

function tokenMachine() {
	const tokens = readFile("/files/", "tokens.json",) || {};
	function checkToken(token) {
		return tokens?.[token];
	}

	function setToken(user, data = {}) {
		const newToken = getToken();
		tokens[newToken.accessToken] = {
			id: user?.id,
			expiresAt: newToken.expiresAt,
			ip: data.ip,
			ts: Date.now(),
			userAgent: data.userAgent,
			geo: data.geo
		};
		writeFile("/files/", "tokens.json", tokens)
		return newToken;
	}

	function checkList() {
		return tokens;
	}
	return {
		checkToken,
		setToken,
		checkList,
	};
}

module.exports = tokenMachine();