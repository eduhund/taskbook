const checkUser = require("./checkUser/checkUser");
const checkCredentials = require("./checkCredentials/checkCredentials");
const checkTransaction = require("./checkTransaction/checkTransaction");
const checkOTK = require("./checkOTK/checkOTK");
const authUser = require("./authUser/authUser");
const updatePass = require("./updatePass/updatePass");

module.exports = {
	checkUser,
	checkCredentials,
	checkTransaction,
	checkOTK,
	authUser,
	updatePass,
};
