const { MongoClient } = require("mongodb");

const DB_URL = process.env.DATABASE_URL;
const DB_NAME = process.env.DATABASE_NAME;

const mongoClient = new MongoClient(DB_URL);

function getCollection(name) {
	return mongoClient.db(DB_NAME).collection(name);
}

function start() {
	mongoClient.connect();
}

module.exports = {
	start,
	getCollection,
};
