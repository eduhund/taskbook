const { log } = require("../../../services/logger");
const { db } = require("../mongo");

function getCounselor({ query = {}, returns = [] }) {
	const projection = {
		_id: 0,
	};
	for (const param of returns) {
		projection[param] = 1;
	}
	return db.COUNSELOR.find(query, { projection }).toArray();
}

module.exports.getCounselor = getCounselor;
