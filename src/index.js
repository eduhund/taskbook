require("dotenv").config();

const fs = require("fs");
const https = require("https");

const { log } = require("./utils/logger");
const { app } = require("./services/express");

const port = process.env.SERVER_PORT;

const options = {};
try {
	options.cert = fs.readFileSync(process.env.SSL_CERT);
	options.key = fs.readFileSync(process.env.SSL_KEY);
} catch (e) {
	log.error("Can't download SSL certificates: ", e);
}

const server = https.createServer(options, app);

server.listen(port, () => {
	log.info(`Server started on port ${server.address().port}`);
});
