const { log } = require("../../../services/logger/logger");
const { PAYMENTS } = require("../mongo");

function setPayment({ payment = {}, returns = [] }) {
	const projection = {
		_id: 0,
	};
	for (const param of returns) {
		projection[param] = 1;
	}
	return PAYMENTS.insertOne(payment, {
		projection,
	});
}

module.exports = setPayment;
