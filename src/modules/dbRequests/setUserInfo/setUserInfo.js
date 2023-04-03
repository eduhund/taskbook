const { log } = require("../../../services/logger");
const { db } = require("../mongo");

async function setUserInfo({ email, data }) {
	const user = await db.USERS.findOneAndUpdate(
		{ email },
		{ $set: data },
		{ upsert: false, returnDocument: "after" }
	);
	log.info(`${user.value?.id}: User info updated!`);
	return user.value;
}

module.exports.setUserInfo = setUserInfo;
