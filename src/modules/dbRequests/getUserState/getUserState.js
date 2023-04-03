const { log } = require("../../../services/logger");
const { db } = require("../mongo");

function getUserState({ query = {}, returns = [] }) {
	const projection = {
		_id: 0,
	};
	for (const param of returns) {
		projection[param] = 1;
	}
	return db.STATE.find(query, { projection }).toArray();
}

module.exports.getUserState = getUserState;
