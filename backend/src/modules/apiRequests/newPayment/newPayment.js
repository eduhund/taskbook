const { getDBRequest } = require("../../dbRequests/dbRequests");
const { createUser } = require("../createUser/createUser");
const { calculateDeadline } = require("../../../utils/calculators");
const { hashPass } = require("../../../utils/pass");
const { setKey } = require("../../../services/tokenMachine/OTK");
const { log } = require("../../../services/logger/logger");
const { prepareMail } = require("../../../services/mailer/actions");
const { sendMail } = require("../../../services/mailer/actions");

function checkSource(body) {
	const keys = Object.keys(body)

	if (keys.includes("gumroad_fee")) {
		return "Gumroad";
	}

	if (keys.includes("sign")) {
		return "Tilda";
	}

	return undefined
}

function splitName(name) {
	if (name) {
		const [firstName, lastName] = name.split(" ", 2);
		return {
			firstName,
			lastName,
		};
	} else return {}

}

function prepareData(source, data, date) {
	const initData = { source, ts: Date.now() };
	const products = {
		["_-jg_yvw1calvFhRDQaqJg=="]: "HSE",
		["DYGiKngRwU-N1dt_WOJ0lg=="]: "HSP",
	};

	switch (source) {
		case "Gumroad":
			return {
				...initData,
				date,
				email: data.email,
				firstName: data["First Name"],
				lastName: data["Last Name"],
				paymentId: data.sale_id,
				moduleId: products[data.product_id],
				value: data.price,
				currency: "USD",
			};
		case "Tilda":
			const moduleId = data.payment.products[0].sku.slice(0, 3);
			const isProlongation = data.payment.products[0].sku.includes("+");
			return {
				...initData,
				date,
				email: data.email,
				...splitName(data.name),
				paymentId: data.payment.orderid,
				moduleId,
				isProlongation,
				value: data.payment.products[0].price,
				currency: "RUB",
			};
		default:
			throw new Error("Payment data wasn't prepared")
	}
}

function getDateObject(date) {
	const timestamp = date ? Date.parse(date) : Date.mow();
	return new Date(timestamp);
}

function getISODateOny(date) {
	const dateObject = typeof date === "string" ? getDateObject(date) : date;
	return dateObject.toISOString().split("T")[0];
}

async function newPayment(req, res) {

	const { body } = req;

	if (body.test) {
		res.sendStatus(200);
		return;
	}

	log.debug(body);
	const date = new Date(Date.now());

	const source = checkSource(body);

	if (!source) {
		res.status(400);
		res.send({
			OK: false,
			error: "invalid_params"
		})
		return
	}

	const payment = prepareData(source, body, date);

	log.debug(payment);

	const moduleInfo = await getDBRequest("getModuleInfo", {
		query: { code: payment.moduleId.toUpperCase() },
	});

	if (!moduleInfo) {
		res.status(400);
		res.send({
			OK: false,
			error: "invalid_params"
		})
		return
	}

	const user = await getDBRequest("getUserInfo", {
		query: { email: payment.email },
	});

	let start = getISODateOny(date);

	if (body.start) {
		const dateArray = body.start.split(".");
		const startDateNormilized = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
		start = getISODateOny(startDateNormilized);
	}

	const duration = payment.value === "1000" ? 1 : 62;
	let deadline = calculateDeadline(start, duration);

	if (!user) {
		const userPass = Math.random().toString(36).substring(2);
		const lang = source === "Tilda" ? "ru" : "en";

		const newUser = {
			email: payment.email,
			pass: userPass ? hashPass(userPass) : "",
			firstName: payment.firstName,
			lastName: payment.lastName,
			modules: {
				[payment.moduleId]: {
					start,
					deadline,
					prolongations: [],
				},
			},
			lang,
		};

		const createdUser = await getDBRequest("addUser", newUser);

		const secureKey = await setKey(createdUser?.id, "oneTimeKey");

		const link = `${process.env.FRONTEND_URL}/createPassword?email=${payment.email}&verifyKey=${secureKey}&lang=${lang}`;

		const params = {
			lang,
			status: "new",
			type: "buy",
			start: getISODateOny(date) < start ? "date" : "now",
		};

		const data = {
			NAME: newUser?.firstName || "",
			MODULE: moduleInfo?.name || "",
			MODULELINK: moduleInfo?.moduleLink || "",
			MASCOTLETTERTOP: moduleInfo?.mascot?.letterTop || "",
			MASCOTLETTERBOTTOM: moduleInfo?.mascot?.letterBottom || "",
			START_DATE: new Date(Date.parse(start)).toLocaleDateString("ru-RU", {
				month: "long",
				day: "numeric",
			}),
			PASSWORD: userPass || "",
			PASSWORD_LINK: link,
		};

		const mail = prepareMail({ params, data });

		sendMail(mail, newUser?.email, "eduHund");

	} else if (payment?.isProlongation) {
		deadline = calculateDeadline(
			user?.modules[payment.moduleId].deadline,
			62
		);

		const prolData = {
			type: "renewal",
			paymentId: payment.paymentId,
			until: deadline,
		};

		user.modules[payment?.moduleId].deadline = deadline
		if (!Array.isArray(user.modules[payment?.moduleId].prolongations)) {
			user.modules[payment?.moduleId].prolongations = []
		}
		user.modules[payment?.moduleId].prolongations.push(prolData)

		await getDBRequest("setUserInfo", {
			id: user?.id,
			data: { modules: user.modules },
		});

		const params = {
			lang: "ru" || user?.lang,
			status: "renew",
		};

		const data = {
			NAME: user?.firstName || "",
			MODULE: moduleInfo?.name || "",
			MODULELINK: moduleInfo?.moduleLink || "",
			MASCOTLETTERTOP: moduleInfo?.mascot?.letterTop || "",
			MASCOTLETTERBOTTOM: moduleInfo?.mascot?.letterBottom || "",
			START_DATE: new Date(Date.parse(start)).toLocaleDateString("ru-RU", {
				month: "long",
				day: "numeric",
			}),
		};
		const mail = prepareMail({ params, data });

		sendMail(mail, user?.email, "eduHund");

	} else {

		const activeModules = Object.entries(user.modules || {}).filter(
			([, value]) =>
				Date.now() - Date.parse(value.deadline) <= 7 * 24 * 60 * 60 * 1000
		);

		for (const [id] of activeModules) {
			const isCurrent = id === payment?.moduleId
			const type = isCurrent ? "newBuy" : "otherModule";
			const data = {
				type,
				paymentId: payment.paymentId,
				until: deadline,
			};

			user.modules[id].deadline = deadline
			if (!Array.isArray(user.modules[id].prolongations)) {
				user.modules[id].prolongations = []
			}
			user.modules[id].prolongations.push(data)
		}

		if (!user.modules[payment.moduleId]) {
			user.modules[payment.moduleId] = {
				start,
				deadline,
				prolongations: [{
					type: "newBuy",
					paymentId: payment.paymentId,
					until: deadline,
				}]
			}
		}

		await getDBRequest("setUserInfo", {
			id: user?.id,
			data: { modules: user.modules },
		});

		const params = {
			lang: user?.lang || "en",
			status: "current",
			type: "buy",
			start: getISODateOny(date) < start ? "date" : "now",
		};

		const data = {
			NAME: user?.firstName || "",
			MODULE: moduleInfo?.name || "",
			MODULELINK: moduleInfo?.moduleLink || "",
			MASCOTLETTERTOP: moduleInfo?.mascot?.letterTop || "",
			MASCOTLETTERBOTTOM: moduleInfo?.mascot?.letterBottom || "",
			START_DATE: new Date(Date.parse(start)).toLocaleDateString("ru-RU", {
				month: "long",
				day: "numeric",
			}),
		};

		const mail = prepareMail({ params, data });

		sendMail(mail, user?.email, "eduHund");
	}

	const response = await getDBRequest("setPayment", { payment });

	if (response?.acknowledged) {
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}

	return;
}

module.exports = newPayment;
