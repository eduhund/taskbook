const { db } = require("../mongo");

async function setUserInfo({ email, data }) {
	const user = await db.USERS.findOneAndUpdate(
		{ email },
		{ $set: data },
		{ upsert: false, returnDocument: "after" }
	);
	return user.value;
}

module.exports.setUserInfo = setUserInfo;
