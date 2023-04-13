const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.DATABASE_URL);
mongoClient.connect();

const USERS = mongoClient.db(process.env.DATABASE_NAME).collection("users");
const TASKS = mongoClient.db(process.env.DATABASE_NAME).collection("tasks");
const STATE = mongoClient.db(process.env.DATABASE_NAME).collection("state");
const MODULES = mongoClient.db(process.env.DATABASE_NAME).collection("modules");
const ACTIONS = mongoClient.db(process.env.DATABASE_NAME).collection("actions");
const CERTS = mongoClient.db(process.env.DATABASE_NAME).collection("certs");
const PAYMENTS = mongoClient
	.db(process.env.DATABASE_NAME)
	.collection("payments");
const COUNSELOR = mongoClient
	.db(process.env.DATABASE_NAME)
	.collection("counselor");

module.exports.db = {
	USERS,
	TASKS,
	STATE,
	MODULES,
	ACTIONS,
	CERTS,
	PAYMENTS,
	COUNSELOR,
};
