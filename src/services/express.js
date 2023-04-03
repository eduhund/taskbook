const express = require("express");
const cors = require("cors");
const { paramsProcessor } = require("../utils/validate");
const { PUBLIC } = require("../modules/apiRequests/apiRequests");

const app = express();
const apiRouter = express.Router();

app.use(cors());
app.use(express.static("static"));
app.use("/diplomas", express.static("diplomas"));
app.use(express.json());
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(paramsProcessor);
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

module.exports = { app };
