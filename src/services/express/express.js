const express = require("express");
const cors = require("cors");
const { log } = require("@logger");

const { PUBLIC, TEACHER } = require("../../modules/apiRequests/apiRequests");
const { checkAdmin } = require("./security");
const { paramsProcessor } = require("../../utils/validate");

const { SERVER_PORT = 8888, ORIGIN = "*" } = process.env;

const app = express();

const corsOptions = {
	origin: ORIGIN,
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(require("body-parser").urlencoded({ extended: false }));

app.use("/diplomas", express.static("diplomas"));

// API v.2
const student = express.Router();
app.use("/student", student);
student.use(paramsProcessor);
for (const request of PUBLIC) {
	const { path, method, exec } = request;
	switch (method) {
		case "get":
			student.get(path, exec);
		case "post":
			student.post(path, exec);
	}
}

const oldTeacher = express.Router();
app.use("/teacher", oldTeacher);
oldTeacher.use(checkAdmin);
for (const request of TEACHER) {
	const { path, method, exec } = request;
	switch (method) {
		case "get":
			oldTeacher.get(path, exec);
		case "post":
			oldTeacher.post(path, exec);
	}
}

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
