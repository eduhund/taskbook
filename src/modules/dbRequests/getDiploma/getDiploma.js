const { log } = require("../../../services/logger");
const { db } = require("../mongo");

function getDiploma({ query = {}, returns = [] }) {
	const projection = {
		_id: 0,
	};
	for (const param of returns) {
		projection[param] = 1;
	}
	return db.CERTS.findOne(query, { projection });
}

module.exports.getDiploma = getDiploma;
