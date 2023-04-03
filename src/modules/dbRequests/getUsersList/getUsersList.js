const { log } = require("../../../services/logger");
const { db } = require("../mongo");

function getUsersList({ query = {}, returns = [] }) {
	const projection = {
		_id: 0,
	};
	for (const param of returns) {
		projection[param] = 1;
	}
	return db.USERS.find(query, {
		projection,
	}).toArray();
}

module.exports.getUsersList = getUsersList;
