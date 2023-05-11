const {
	getUserInfo,
	checkTransaction,
	authUser,
} = require("../../../processes/processes");

async function checkPayment(req, res, next) {
	try {
		const { data } = req;

		const transactionIsValid = await checkTransaction(data, next);
		if (!transactionIsValid) return;

		const userExists = await getUserInfo(data, next);
		if (!userExists) return;

		const content = await authUser(data);
		next({ code: 0, content });
	} catch {
		const err = { code: 20203 };
		next(err);
	}
}

module.exports = checkPayment;
