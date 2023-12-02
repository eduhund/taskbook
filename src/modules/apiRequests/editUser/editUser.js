const { log } = require("../../../services/logger/logger");
const { USERS } = require("../../dbRequests/mongo");

async function editUser({ id, data, type }) {
	log.info("Editing user: " + id);
	const update = type === "push" ? { $push: data } : { $set: data };
	try {
		const newData = await USERS.findOneAndUpdate({ id }, update, {
			projection: { _id: 0, pass: 0, token: 0 },
			returnDocument: "after",
			returnNewDocument: true,
		});
		return newData?.value;
	} catch {}
}

module.exports.editUser = editUser;
