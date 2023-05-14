const DB = require("@mongo/requests");

function padder(number = 0, count = 1) {
	return number.toString().padStart(count, "0");
}

async function generateCertId(userId, moduleId, startDate) {
	const certsCount =
		(await DB.count("certs", { query: { moduleId, startDate } })) || 0;

	const postfix = padder(certsCount + 1, 4);
	const date = new Date(Date.parse(startDate));
	const datePart = `${padder(date.getFullYear() - 2000, 2)}${padder(
		date.getMonth(),
		2
	)}`;
	const certId = `${moduleId}${datePart}${postfix}`;

	DB.insertOne("certs", {
		query: {
			id: certId,
			userId,
			moduleId,
			startDate,
			public: false,
		},
	});

	const path = `modules.${moduleId}.certId`;

	DB.setOne("users", { query: { id: userId }, set: { [path]: certId } });

	return certId;
}

module.exports = generateCertId;
