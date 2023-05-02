const getUser = require("./getUser/getUser");
const checkCredentials = require("./checkCredentials/checkCredentials");
const checkTransaction = require("./checkTransaction/checkTransaction");
const checkOTK = require("./checkOTK/checkOTK");
const authUser = require("./authUser/authUser");
const updatePass = require("./updatePass/updatePass");

module.exports = {
	getUser,
	checkCredentials,
	checkTransaction,
	checkOTK,
	authUser,
	updatePass,
};
