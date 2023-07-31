const { MongoClient } = require("mongodb");
const { log } = require("@logger");

const { DB_URL, DB_NAME } = process.env;

const mongoClient = new MongoClient(DB_URL);

function getCollection(name) {
	return mongoClient.db(DB_NAME).collection(name);
}

async function start() {
	await mongoClient.connect();
	log.info("Connected to database successfully");
}

module.exports = {
	start,
	getCollection,
};
