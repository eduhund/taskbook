const express = require("express");
const cors = require("cors");
const { log } = require("@logger");

const {
  PUBLIC,
  STUDENT,
  TEACHER,
} = require("../../modules/apiRequests/apiRequests");
const { checkAdmin } = require("./security");
const { paramsProcessor } = require("../../utils/validate");
const { responseHandler, pathHandler } = require("./responses");

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

app.use(paramsProcessor);

// API v.2
const student = express.Router();
app.use("/student", student);
for (const request of STUDENT) {
  const { path, method, exec } = request;
  switch (method) {
    case "get":
      student.get(path, exec);
    case "post":
      student.post(path, exec);
  }
}

const teacher = express.Router();
app.use("/teacher", teacher);
teacher.use(checkAdmin);
for (const request of TEACHER) {
  const { path, method, exec } = request;
  switch (method) {
    case "get":
      teacher.get(path, exec);
    case "post":
      teacher.post(path, exec);
  }
}

const public = express.Router();
app.use("/public", public);
for (const request of PUBLIC) {
  const { path, method, exec } = request;
  switch (method) {
    case "get":
      public.get(path, exec);
    case "post":
      public.post(path, exec);
  }
}

app.use(responseHandler);
app.use(pathHandler);

function start() {
  return new Promise((resolve, reject) => {
    log.info("Starting server...");
    app.listen(SERVER_PORT, (err) => {
      if (err) {
        reject({ message: "Failed to start server!", trace: err });
      }
      log.info("Server started on port", SERVER_PORT);
      resolve();
    });
  });
}

module.exports = { start };
