const express = require("express");
const cors = require("cors");
const { log } = require("@logger");

const { PUBLIC } = require("../../modules/apiRequests/apiRequests");
const { STUDENT } = require("../../API/student/student");
const { responseHandler, pathHandler } = require("./responses");
const prepareRequestData = require("./prepareRequestData");
const { checkAuth } = require("./security");
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
/*
app.use((req, res, next) => {
	log.info(req?.query, req?.body, req?.path);
	next();
});
*/

// API v.2
const apiRouter = express.Router();
app.use("/api/v2", apiRouter);
apiRouter.use(paramsProcessor);
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
