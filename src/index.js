require("dotenv").config();

const { defaultLanguage } = require("../config.json");

const { log } = require("./utils/logger");
const fs = require("fs");
const express = require("express");
const https = require("https");
const cors = require("cors");
const path = require("node:path");

const { getDBRequest } = require("./modules/dbRequests/dbRequests");
const { getApiRequest } = require("./modules/apiRequests/apiRequests");
const { addUserAction } = require("./modules/statistics/addUserAction");

const { hashPass } = require("./utils/pass");
const { checkKey } = require("./utils/otkRequests");
const { validate } = require("./utils/validate");
const {
	checkAuth,
	checkModuleAccess,
	checkCertAccess,
} = require("./utils/checkAuth");

const app = express();
const port = process.env.SERVER_PORT;

const options = {
	cert: fs.readFileSync(process.env.SSL_CERT),
	key: fs.readFileSync(process.env.SSL_KEY),
};

const apiRouter = express.Router();
const diplomas = express.Router();

app.use(cors());
app.use(express.static("static"));
app.use("/diplomas", express.static("diplomas"));
app.use(express.json());
app.use(require("body-parser").urlencoded({ extended: false }));
app.use("/api/v2", apiRouter);

const { lowerString } = require("./utils/lowString");

// API v.2
// Auth
apiRouter.post("/auth", (req, res) => {
	const email = lowerString(req.body.email);
	const pass = req.body.pass;
	const lang = ["ru, en"].includes(req.body.lang)
		? req.body.lang
		: defaultLanguage;

	getApiRequest("authUser", { email, pass, lang }).then((response) => {
		if (response?.OK) {
			res.status(200);
			res.send(response);
		} else {
			res.status(401);
			res.send({
				OK: false,
				error: response?.error,
				errorDescription: response?.errorDescription,
				errorCode: response?.status,
			});
		}
	});
});

// Create new password
apiRouter.post("/createPassword", async (req, res) => {
	const email = lowerString(req.body.email);
	const newPass = req.body.newPass;
	const verifyKey = req.body.verifyKey;
	if (await checkKey(verifyKey)) {
		getDBRequest("setUserInfo", { email, data: { pass: hashPass(newPass) } })
			.then((user) => {
				if (user) {
					return getApiRequest("authUser", { email, pass: newPass });
				} else
					return {
						OK: false,
						error: "Password didn't set",
						error_description: "Password setting failure",
						error_code: 100011,
					};
			})
			.then((response) => {
				if (response?.status === 0) {
					res.status(200);
					res.send({
						OK: true,
						data: response.data,
					});
				} else {
					res.status(401);
					res.send({
						OK: false,
						error: response?.error,
						errorDescription: response?.errorDescription,
						errorCode: response?.status,
					});
				}
			});
	} else {
		res.status(401);
		res.send({
			OK: false,
			error: "invalid_verify key",
			error_description: "Verify key is invalid or expires",
			error_code: 100010,
		});
	}
});

// Get task data (content + state)
apiRouter.get("/getTask", checkAuth, checkModuleAccess, (req, res) => {
	const userId = req?.userId;
	const taskId = req?.query?.taskId;
	if (validate(res, taskId)) {
		addUserAction({
			userId,
			action: "getTask",
			data: { taskId },
			req,
		});
		getApiRequest("getTask", { userId, taskId }).then((data) => {
			res.send(data);
		});
	}
});

// Get data of module's start page
apiRouter.get("/getModuleStart", checkAuth, checkModuleAccess, (req, res) => {
	const userId = req?.userId;
	const moduleId = req?.query?.moduleId;
	if (validate(res, moduleId)) {
		addUserAction({
			userId,
			action: "getModuleStart",
			data: { moduleId },
			req,
		});
		getApiRequest("getModuleStart", { userId, moduleId }).then((data) => {
			res.send(data);
		});
	} else {
		res.status(403);
		res.send({
			OK: false,
			error: "blocked_content",
			error_description: "User don't have access to this content",
			error_code: 10011,
		});
	}
});

// Get data of module's final page
apiRouter.get("/getModuleFinal", checkAuth, checkCertAccess, (req, res) => {
	const userId = req?.userId;
	const moduleId = req?.query?.moduleId;
	if (validate(res, moduleId)) {
		addUserAction({
			userId,
			action: "getModuleFinal",
			data: { moduleId },
			req,
		});
		getApiRequest("getModuleFinal", { userId, moduleId }).then((data) => {
			res.send(data);
		});
	} else {
		res.status(403);
		res.send({
			OK: false,
			error: "blocked_content",
			error_description: "User don't have access to this content",
			error_code: 10011,
		});
	}
});

// Get data of lesson's start page
apiRouter.get("/getLessonStart", checkAuth, checkModuleAccess, (req, res) => {
	const userId = req?.userId;
	const fullLessonId = req?.query?.lessonId;
	if (validate(res, fullLessonId)) {
		addUserAction({
			userId,
			action: "getLessonStart",
			data: { lessonId: fullLessonId },
			req,
		});
		getApiRequest("getLessonStart", { userId, fullLessonId }).then((data) => {
			res.send(data);
		});
	}
});

// Get data of lessons's final page
apiRouter.get("/getLessonFinal", checkAuth, checkModuleAccess, (req, res) => {
	const userId = req?.userId;
	const fullLessonId = req?.query?.lessonId;
	if (validate(res, fullLessonId)) {
		addUserAction({
			userId,
			action: "getLessonFinal",
			data: { lessonId: fullLessonId },
			req,
		});
		getApiRequest("getLessonFinal", { userId, fullLessonId }).then((data) => {
			res.send(data);
		});
	}
});

// Get diploma's data
apiRouter.get("/getDiploma", checkAuth, checkCertAccess, (req, res) => {
	const userId = req?.userId;
	const moduleId = req?.query?.moduleId;
	if (validate(res, moduleId)) {
		addUserAction({
			userId,
			action: "getDiploma",
			data: { moduleId },
			req,
		});
		getApiRequest("getDiploma", { userId, moduleId }).then((data) => {
			res.send(data);
		});
	}
});

// Get module's main info
apiRouter.get("/getModuleInfo", checkAuth, checkModuleAccess, (req, res) => {
	const userId = req?.userId;
	const moduleId = req?.query?.moduleId;
	if (validate(res, moduleId)) {
		getApiRequest("getModuleInfo", { userId, moduleId }).then((data) => {
			res.send(data);
		});
	}
});

// Get lessons's navigation info
apiRouter.get("/getLessonsList", checkAuth, checkModuleAccess, (req, res) => {
	const userId = req?.userId;
	const moduleId = req?.query?.moduleId;
	if (validate(res, moduleId)) {
		getApiRequest("getLessonsList", { userId, moduleId }).then((data) => {
			res.send(data);
		});
	}
});

// Get module's navigation info
apiRouter.get("/getTasksList", checkAuth, checkModuleAccess, (req, res) => {
	const userId = req?.userId;
	const fullLessonId = req?.query?.lessonId;
	if (validate(res, fullLessonId)) {
		getApiRequest("getTasksList", { userId, fullLessonId }).then((data) => {
			res.send(data);
		});
	}
});

// Get dashboard content
apiRouter.get("/getDashboard", checkAuth, (req, res) => {
	const userId = req?.userId;
	addUserAction({
		userId,
		action: "getDashboard",
		data: {},
		req,
	});
	getApiRequest("getDashboard", { userId }).then((data) => {
		res.send(data);
	});
});

// Set new task state
apiRouter.post("/setState", checkAuth, (req, res) => {
	const userId = req?.userId;
	const questionId = req.body.questionId;
	const state = req.body.state;

	if (validate(res, questionId, state)) {
		addUserAction({
			userId,
			action: "updateState",
			data: { questionId, state },
			req,
		});
		getApiRequest("setState", { userId, questionId, state }).then((data) => {
			res.send(data);
		});
	}
});

// Set task's controls state
apiRouter.post("/setControls", checkAuth, (req, res) => {
	const userId = req?.userId;
	const taskId = req.body.taskId;
	const controlsState = req.body.controlsState;

	if (validate(res, taskId, controlsState)) {
		addUserAction({
			userId,
			action: "setControls",
			data: { taskId, controlsState },
			req,
		});
		getApiRequest("setControls", { userId, taskId, controlsState }).then(
			(data) => {
				res.send(data);
			}
		);
	}
});

// Set new task comment
apiRouter.post("/addComment", checkAuth, (req, res) => {
	const userId = req?.userId;
	const taskId = req.body.taskId;
	const comment = req.body.comment || "";
	const protest = req.body.protest || false;

	if (validate(res, taskId, comment)) {
		addUserAction({
			userId,
			action: "addComment",
			data: { comment, protest },
			req,
		});
		getApiRequest("addComment", { userId, taskId, comment, protest }).then(
			(result) => res.send(result)
		);
	}
});

// Task checking
apiRouter.post("/checkTask", checkAuth, (req, res) => {
	const userId = req?.userId;
	const taskId = req.body.taskId;
	const isChecked = req.body.isChecked;
	const protest = req.body.protest;

	if (validate(res, taskId, typeof isChecked === "boolean")) {
		addUserAction({
			userId,
			action: "checkTask",
			data: { taskId, isChecked, protest },
			req,
		});
		getApiRequest("checkTask", { userId, taskId, isChecked, protest }).then(
			(data) => {
				res.send(data);
			}
		);
	}
});

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

const server = https.createServer(options, app);

server.listen(port, () => {
	log.info(`Server started on port ${server.address().port}`);
});
