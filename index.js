require("dotenv").config();
require("module-alias/register");

const { log } = require("@logger");
const server = require("@express/express");

async function start() {
	try {
		await server.start();
		log.info("All systems running. Let's rock!");
	} catch (e) {
		log.error("Hewston, we have a problem!\n", e);
		process.exit();
	}
}

start();
