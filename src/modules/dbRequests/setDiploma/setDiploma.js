const { CERTS } = require("../mongo");

function setDiploma({ query = {}, data = {}, returns = [] }) {
	const projection = {
		_id: 0,
	};
	for (const param of returns) {
		projection[param] = 1;
	}
	return CERTS.findOneAndUpdate(
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

module.exports = setDiploma;
