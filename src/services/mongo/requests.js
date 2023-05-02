const { getCollection } = require("./mongo");

function getProjection(returns) {
	const projection = {
		_id: 0,
	};
	for (const param of returns) {
		projection[param] = 1;
	}
	return projection;
}

function database(collection, method, data) {
	const { query, set, returns = [], options = {} } = data;

	const projection = getProjection(returns);

	const moreOptions = {
		upsert: options.insertNew || false,
		returnDocument: "after",
		returnNewDocument: true,
	};

	const requests = {
		getOne: () => {
			return getCollection(collection).findOne(query, { projection });
		},
		setOne: async () => {
			const data = await getCollection(collection).findOneAndUpdate(
				query,
				{ $set: set },
				{ projection, ...moreOptions }
			);
			return data?.value || null;
		},
	};

	try {
		return requests[method]();
	} catch {
		throw new Error("Error with database");
	}
}

module.exports = database;
