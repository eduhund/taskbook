const checkUser = require("./checkUser/checkUser");
const checkCredentials = require("./checkCredentials/checkCredentials");
const checkPayment = require("./checkPayment/checkPayment");
const checkOTK = require("./checkOTK/checkOTK");
const authUser = require("./authUser/authUser");
const updatePass = require("./updatePass/updatePass");

module.exports = {
	checkUser,
	checkCredentials,
	checkPayment,
	checkOTK,
	authUser,
	updatePass,
};
