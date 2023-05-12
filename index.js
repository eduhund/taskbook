require("dotenv").config();
require("module-alias/register");

const { log } = require("@logger");
const mongo = require("@mongo");
const server = require("@express");

async function start() {
	try {
		await mongo.start();
		await server.start();
		log.info("All systems running. Let's rock!");
	} catch (e) {
		log.error("Hewston, we have a problem!\n", e);
		process.exit();
	}
}

start();
