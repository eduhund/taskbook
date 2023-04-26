const { db } = require("../mongo");

function getPaymentInfo({ query = {}, returns = [] }) {
	const projection = {
		_id: 0,
	};
	for (const param of returns) {
		projection[param] = 1;
	}
	return db.PAYMENTS.findOne(query, { projection });
}

module.exports.getPaymentInfo = getPaymentInfo;
