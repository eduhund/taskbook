const { db } = require("../modules/dbRequests/mongo");
const { log } = require("@logger");

function padder(number = 0, count = 1) {
	return number.toString().padStart(count, "0");
}

async function generateCertId(userId, moduleId, startDate) {
	const certsCount =
		(await db.CERTS.countDocuments({ moduleId, startDate })) || 0;

	const postfix = padder(certsCount + 1, 4);
	const date = new Date(Date.parse(startDate));
	const datePart = `${padder(date.getFullYear() - 2000, 2)}${padder(
		date.getMonth(),
		2
	)}`;
	const certId = `${moduleId}${datePart}${postfix}`;

	db.CERTS.insertOne({
		id: certId,
		userId,
		moduleId,
		startDate,
		public: false,
	});

	const path = `modules.${moduleId}.certId`;

	db.USERS.findOneAndUpdate({ id: userId }, { $set: { [path]: certId } });

	return certId;
}

module.exports.generateCertId = generateCertId;
