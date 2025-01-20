require("dotenv").config();
require("module-alias/register");

const { log } = require("@logger");
const server = require("@express/express");
const { dbConnect } = require("@mongo/mongo");

async function start() {
  try {
    await dbConnect();
    await server.start();
    log.info("All systems running. Let's rock!");
  } catch ({ message, trace }) {
    log.error("Hewston, we have a problem!");
    log.debug(message);
    log.trace(trace);
    process.exit();
  }
}

start();
