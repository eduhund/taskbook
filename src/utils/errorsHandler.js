const { log } = require("@logger");
const { responseGenerator } = require("@utils/responseGenerator");

function errorHandler(message, req, res, next) {
	const { code, content } = message;
	const { data } = req;
	if (!code) {
		log.debug({ input: data, output: message });
		res.status(200).send(responseGenerator(0, content));
		return;
	}
	const error = responseGenerator(code || -1);
	if (code > 10000 && code < 20000) {
		log.debug({ input: data, output: error });
		res.status(400).send(error);
		return;
	} else {
		log.error({ input: data, output: error });
		res.status(500).send(error);
		return;
	}
}

function pathHandler(req, res, next) {
	res.status(404);
	res.send(responseGenerator(10001));
}

module.exports = { errorHandler, pathHandler };
