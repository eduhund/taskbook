const express = require("express");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const { log } = require("@logger");

const { PUBLIC } = require("../../modules/apiRequests/apiRequests");
const { STUDENT } = require("../../API/student/student");
const { responseHandler, pathHandler } = require("./responses");
const prepareRequestData = require("./prepareRequestData");
const { checkAuth } = require("./security");

const port = process.env.SERVER_PORT || 443;

const app = express();

const options = {};

try {
	options.cert = fs.readFileSync(process.env.SSL_CERT);
	options.key = fs.readFileSync(process.env.SSL_KEY);
} catch {
	throw new Error("Can't download SSL certificates!");
}

app.use(express.static("static"));
app.use("/diplomas", express.static("diplomas"));
app.use(cors());
app.use(express.json());
app.use(require("body-parser").urlencoded({ extended: false }));

// API v.2
const apiRouter = express.Router();
app.use("/api/v2", apiRouter);
for (const request of PUBLIC) {
	const { path, method, exec } = request;
	switch (method) {
		case "get":
			apiRouter.get(path, exec);
		case "post":
			apiRouter.post(path, exec);
	}
}

// API v.3
const student = express.Router();
//app.use(checkAuth);
app.use("/v3/student", student);

for (const method of STUDENT) {
	const { name, type, wall, exec } = method;
	switch (type) {
		case "get":
			student.get("/" + name, checkAuth(wall), prepareRequestData, exec);
		case "post":
			student.post("/" + name, checkAuth(wall), prepareRequestData, exec);
	}
}

app.use(responseHandler);
app.use(pathHandler);

const server = https.createServer(options, app);

function start() {
	return new Promise((resolve, reject) => {
		server.listen(port, (err) => {
			if (err) {
				return reject(err);
			}
			log.info("Server starts on port", port);
			return resolve();
		});
	});
}

module.exports = { start };
