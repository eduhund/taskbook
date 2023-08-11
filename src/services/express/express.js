const express = require("express");
const cors = require("cors");
const { log } = require("@logger");

const { STUDENT } = require("../../API/student/student");
const { responseHandler, pathHandler } = require("./responses");
const prepareRequestData = require("./prepareRequestData");
const { checkAuth } = require("./security");

const { SERVER_PORT } = process.env;

const corsOptions = {
	origin: process.env.ORIGIN || "*",
	optionsSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(require("body-parser").urlencoded({ extended: false }));

// API v.3
const student = express.Router();
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

function start() {
	return new Promise((resolve, reject) => {
		app.listen(SERVER_PORT, (err) => {
			if (err) {
				return reject(err);
			}
			log.info("Server starts on port", SERVER_PORT);
			return resolve();
		});
	});
}

module.exports = { start };
