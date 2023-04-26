const { db } = require("../mongo");

function getModuleInfo({ query = {}, returns = [] }) {
	const projection = {
		_id: 0,
	};
	for (const param of returns) {
		projection[param] = 1;
	}
	return db.MODULES.findOne(query, { projection });
}

module.exports.getModuleInfo = getModuleInfo;
