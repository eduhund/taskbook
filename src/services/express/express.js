const express = require("express");
const cors = require("cors");
const { paramsProcessor } = require("../../utils/validate");
const { PUBLIC } = require("../../modules/apiRequests/apiRequests");
const STUDENT = require("../../API/student/student");

const app = express();

app.use(cors());
app.use(express.static("static"));
app.use("/diplomas", express.static("diplomas"));
app.use(express.json());
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(paramsProcessor);

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

const METHODS = [...STUDENT];

for (const method of METHODS) {
	const { name, type, exec } = method;
	switch (type) {
		case "get":
			apiRouter.get(name, exec);
		case "post":
			apiRouter.post(name, exec);
	}
}

module.exports = { app };
