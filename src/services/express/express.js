const express = require("express");
const cors = require("cors");
const { PUBLIC } = require("../../modules/apiRequests/apiRequests");
const { STUDENT } = require("../../API/student/student");
const { errorHandler, pathHandler } = require("@utils/errorsHandler");
const prepareData = require("../../utils/prepareData");

const app = express();

app.use(cors());
app.use(express.static("static"));
app.use("/diplomas", express.static("diplomas"));
app.use(express.json());
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(prepareData);

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
app.use("/v3/student", student);

for (const method of STUDENT) {
	const { name, type, exec } = method;
	switch (type) {
		case "get":
			student.get("/" + name, exec);
		case "post":
			student.post("/" + name, exec);
	}
}

app.use(errorHandler);
app.use(pathHandler);

module.exports = { app };
