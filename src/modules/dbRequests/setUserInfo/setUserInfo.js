const { USERS } = require("../mongo");

async function setUserInfo({ email, id, data }) {
	const query = {}

	if (email) {
		query.email = email
	}

	if (id) {
		query.id = id
	}

	const user = await USERS.findOneAndUpdate(
		query,
		{ $set: data },
		{ upsert: false, returnDocument: "after" }
	);
	return user.value;
}

module.exports = setUserInfo;
