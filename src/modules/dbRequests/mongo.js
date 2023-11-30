const { MongoClient } = require("mongodb");

const { DB_URL, DB_NAME } = process.env;

const mongoClient = new MongoClient(DB_URL);
mongoClient.connect();

const USERS = mongoClient.db(DB_NAME).collection("users");
const TASKS = mongoClient.db(DB_NAME).collection("tasks");
const STATE = mongoClient.db(DB_NAME).collection("state");
const MODULES = mongoClient.db(DB_NAME).collection("modules");
const ACTIONS = mongoClient.db(DB_NAME).collection("actions");
const CERTS = mongoClient.db(DB_NAME).collection("certs");
const PAYMENTS = mongoClient.db(DB_NAME).collection("payments");
const COUNSELOR = mongoClient.db(DB_NAME).collection("counselor");

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
