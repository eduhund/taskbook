const { TASKS } = require("../mongo");

function getTaskInfo({ query = {}, returns = [] }) {
	const projection = {
		_id: 0,
	};
	for (const param of returns) {
		projection[param] = 1;
	}
	return TASKS.findOne(query, { projection });
}

module.exports = getTaskInfo;
