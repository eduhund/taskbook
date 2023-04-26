const { db } = require("../mongo");

function setDiploma({ query = {}, data = {}, returns = [] }) {
	const projection = {
		_id: 0,
	};
	for (const param of returns) {
		projection[param] = 1;
	}
	return db.CERTS.findOneAndUpdate(
		query,
		{
			$set: data,
		},
		{
			projection,
			upsert: true,
			returnDocument: "after",
			returnNewDocument: true,
		}
	);
}

module.exports.setDiploma = setDiploma;
