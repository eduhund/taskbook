const { log } = require("@logger");
const { generateMessage } = require("@utils/messageGenerator");

function errorHandler(err, req, res, next) {
	const { code } = err;
	const error = generateMessage(code || -1);
	log.debug(error);
	if (code > 10000 && code < 20000) {
		log.debug({ input: req?.data, output: err });
		res.status(400).send(error);
	} else {
		log.error({ input: req?.data, output: err });
		res.status(500).send(error);
	}
}

function pathHandler(req, res, next) {
	res.status(404);
	res.send(generateMessage(10001));
}

module.exports = { errorHandler, pathHandler };
