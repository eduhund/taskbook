const { ACTIONS } = require("../mongo");

function addUserAction({ userId, action, data, params }) {
	return ACTIONS.insertOne({
		ts: Date.now(),
		userId,
		action,
		data,
		params,
	});
}

module.exports = addUserAction;
