require("dotenv").config();
require("module-alias/register");

const fs = require("fs");
const https = require("https");

const { log } = require("@logger");
const { app } = require("@express");
const mongo = require("@mongo/mongo");

const port = process.env.SERVER_PORT || 443;

const options = {};

try {
	mongo.start();
	options.cert = fs.readFileSync(process.env.SSL_CERT);
	options.key = fs.readFileSync(process.env.SSL_KEY);
} catch (e) {
	log.error("Can't download SSL certificates!");
	log.debug(e);
	process.exit();
}

const server = https.createServer(options, app);

server.listen(port, () => {
	log.info(`Server started on port ${server.address().port}`);
});
