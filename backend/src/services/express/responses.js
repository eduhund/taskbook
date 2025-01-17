const { log } = require("@logger");

const ERRORS = [
  {
    code: -1,
    type: "other_error",
  },
  {
    code: 10001,
    type: "invalid_request",
    description: "Invalid path",
  },
  {
    code: 10002,
    type: "invalid_request",
    description: "Missing required params",
  },
  {
    code: 10101,
    type: "invalid_credentials",
    description: "User didn't found",
  },
  {
    code: 10102,
    type: "invalid_credentials",
    description: "Invalid password",
  },
  {
    code: 10103,
    type: "invalid_credentials",
    description: "Access token is invalid or expired",
  },
  {
    code: 10104,
    type: "invalid_credentials",
    description: "Invalid refresh token",
  },
  {
    code: 10105,
    type: "invalid_credentials",
    description: "Verify key is invalid or expired",
  },
  {
    code: 10106,
    type: "invalid_credentials",
    description: "Payment didn't found",
  },
  {
    code: 10201,
    type: "access_denied",
    description: "You don't have access to this content",
  },
  {
    code: 10202,
    type: "access_denied",
    description: "You don't have access to this resource",
  },
  {
    code: 10203,
    type: "access_denied",
    description: "You don't have access to add comments",
  },
  {
    code: 10301,
    type: "not_found",
    description: "Module didn't found",
  },
  {
    code: 10302,
    type: "not_found",
    description: "Lesson didn't found",
  },
  {
    code: 10303,
    type: "not_found",
    description: "Task didn't found",
  },
  {
    code: 20101,
    type: "validate_failure",
    description: "Error request params validate",
  },
  {
    code: 20102,
    type: "validate_failure",
    description: "User with this email is already exist",
  },
  {
    code: 20201,
    type: "process_failure",
    description: "Error in auth process",
  },
  {
    code: 20202,
    type: "process_failure",
    description: "Error in create password process",
  },
  {
    code: 20203,
    type: "process_failure",
    description: "Error in check payment process",
  },
  {
    code: 20204,
    type: "process_failure",
    description: "Error in get me process",
  },
  {
    code: 20205,
    type: "process_failure",
    description: "Error in get module process",
  },
  {
    code: 20206,
    type: "process_failure",
    description: "Error in get lesson process",
  },
  {
    code: 20207,
    type: "process_failure",
    description: "Error in get task process",
  },
  {
    code: 20208,
    type: "process_failure",
    description: "Error in set state process",
  },
  {
    code: 20209,
    type: "process_failure",
    description: "Error in set comment process",
  },
  {
    code: 20210,
    type: "process_failure",
    description: "Error in get diploma process",
  },
  {
    code: 20211,
    type: "process_failure",
    description: "Error in get counselor process",
  },
  {
    code: 20212,
    type: "process_failure",
    description: "Error in get comments list process",
  },
  {
    code: 20213,
    type: "process_failure",
    description: "Error in get modules list process",
  },
  {
    code: 20214,
    type: "process_failure",
    description: "Error in createUser process",
  },
];

function responseGenerator(code, data = {}) {
  if (code === 0) {
    return { OK: true, data };
  } else {
    const error = ERRORS.find((error) => error.code === code) || -1;
    return { OK: false, error };
  }
}

function responseHandler(message, req, res, next) {
  const { code, content, trace } = message;
  const { data, query, body } = req;
  const input = { data, query, body };
  if (!code) {
    res.status(200).send(responseGenerator(0, content));
    return;
  }
  const error = responseGenerator(code || -1);
  if (code > 10000 && code < 20000) {
    log.warn(error?.error?.description);
    log.debug({ input, output: error, trace });
    res.status(400).send(error);
    return;
  } else {
    log.warn(error?.error?.description);
    log.debug({ input, output: error, trace });
    res.status(500).send(error);
    return;
  }
}

function pathHandler(req, res, next) {
  log.debug(req.path);
  res.status(404);
  res.send(responseGenerator(10001));
}

module.exports = { responseHandler, pathHandler };
