const { CERTS } = require("../mongo");

function getDiploma({ query = {}, returns = [] }) {
	const projection = {
		_id: 0,
	};
	for (const param of returns) {
		projection[param] = 1;
	}
	return CERTS.findOne(query, { projection });
}

module.exports = getDiploma;
