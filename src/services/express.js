const express = require("express");
const cors = require("cors");

const { PUBLIC } = require("../modules/apiRequests/apiRequests");

const { getApiRequest } = require("../modules/apiRequests/apiRequests");
const { addUserAction } = require("../modules/statistics/addUserAction");

const { validate, paramsProcessor } = require("../utils/validate");
const {
	checkAuth,
	checkModuleAccess,
	checkCertAccess,
} = require("../utils/checkAuth");

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

// API v.2

apiRouter.get("/getCounselor", checkAuth, (req, res) => {
	const userId = req?.userId;
	addUserAction({
		userId,
		action: "getCounselor",
		req,
	});
	getApiRequest("getCounselor", {}).then((data) => {
		res.send(data);
	});
});

module.exports = { app };
