const { MongoClient } = require("mongodb");
const { log } = require("@logger");

const DB_URL = process.env.DATABASE_URL;
const DB_NAME = process.env.DATABASE_NAME;

const mongoClient = new MongoClient(DB_URL);

async function getCollection(name) {
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
