const { log } = require("../../../services/logger");
const { db } = require("../mongo");

function setState({ query = {}, state = {}, returns = [] }) {
	const projection = {
		_id: 0,
	};
	for (const param of returns) {
		projection[param] = 1;
	}
	return db.STATE.findOneAndUpdate(
		query,
		{
			$set: state,
		},
		{
			projection,
			upsert: true,
			returnDocument: "after",
			returnNewDocument: true,
		}
	);
}

module.exports.setState = setState;
