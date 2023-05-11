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

function getOptions(returns, options) {
	return {
		projetion: getProjection(returns),
		upsert: options.insertNew || false,
		returnDocument: "after",
		returnNewDocument: true,
	};
}

const DB = {
	insertOne: (collection, data) => {
		const { query } = data;

		return getCollection(collection).insertOne(query);
	},
	getOne: (collection, data) => {
		const { query, returns = [] } = data;

		const projection = getProjection(returns);

		return getCollection(collection).findOne(query, { projection });
	},
	setOne: async (collection, data) => {
		const { query, set, push, returns = [], options = {} } = data;

		const allOptions = getOptions(returns, options);

		const response = await getCollection(collection).findOneAndUpdate(
			query,
			(set && { $set: set }) || (push && { $push: push }),
			allOptions
		);
		return response?.value || null;
	},

	getMany: async (collection, data) => {
		const { query, returns = [] } = data;

		const projection = getProjection(returns);

		const response = await getCollection(collection)
			.find(query, {
				projection,
			})
			.toArray();
		return response || [];
	},
};

module.exports = DB;
