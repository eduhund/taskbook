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

module.exports = { app };
