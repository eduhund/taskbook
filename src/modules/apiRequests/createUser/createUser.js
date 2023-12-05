const { log } = require("../../../services/logger/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { setKey } = require("../../../services/tokenMachine/OTK")
const { lowerString } = require("../../../utils/stringProcessor")
const { generateMessage } = require("../../../utils/messageGenerator");

async function createUser({req, res}) {
	const { email, pass, firstName, lastName, modules, startDate, deadline, lang } = req.body

	if (!email) {
		res.status(401);
		res.send({
			OK: false,
			error: "missing_parameters",
			error_description: "Missing required parameters",
			error_code: 10008,
		});
		return
	}
	const userEmail = lowerString(email);

	const checkResult = await getDBRequest("checkUsername", {
		email: userEmail,
	});

	if (!checkResult) {
		const userModules = {};
		(modules || []).forEach((userModule) => {
			//const date = new Date(Date.now());
			userModules[userModule.id] = {
				start: startDate, // date.toISOString().split("T")[0],
				deadline, //calculateDeadline(date, 80),
			};
		});
		const newUser = {
			email: userEmail,
			pass: pass ? hashPass(pass) : "",
			firstName,
			lastName,
			modules: userModules,
			lang,
		};
		const createdUser = await getDBRequest("addUser", newUser);

		const sendData = {
			OK: true,
			data: {
				id: createdUser.id,
				email: createdUser.email,
				firstName: createdUser.firstName,
				lastName: createdUser.lastName,
			},
		};

		if (!createdUser.pass) {
			const secureKey = await setKey(createdUser.id, "oneTimeKey");
			sendData.data.key = secureKey;
		}

		const data = generateMessage(0, sendData);
		res.status(200).send(data);
	} else {
		res.status(401);
		res.send({
			OK: false,
			error: "user_already_exist",
			error_description: "User with this email is already exist",
			error_code: 10008,
		});
	}
	
	return
};

module.exports = createUser;
