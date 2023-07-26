const fetch = require("node-fetch");

const server = process.env.REG_OTK_SERVER;

async function checkKey(key) {
	const response = await fetch(`${server}/checkKey?key=${key}`);
	const data = await response.json();
	return data?.OK || false;
}

async function setKey(user) {
	const response = await fetch(`${server}/setKey`, {
		method: "POST",
		body: JSON.stringify(user),
		headers: { "Content-Type": "application/json" },
	});
	const data = await response.json();
	return data?.data?.key || undefined;
}

module.exports = { checkKey, setKey };
