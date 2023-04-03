const { log } = require("../../../services/logger");
const { db } = require("../mongo");

function getUserInfo({ query = {}, returns = [] }) {
	const projection = {
		_id: 0,
	};
	for (const param of returns) {
		projection[param] = 1;
	}
	return db.USERS.findOne(query, { projection });
}

module.exports.getUserInfo = getUserInfo;
