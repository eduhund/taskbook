const { getDBRequest } = require("../../dbRequests/dbRequests");
const { createUser } = require("../createUser/createUser");
const { calculateDeadline } = require("../../../utils/calculators");
const { hashPass } = require("../../pass");
const { setKey } = require("../../../services/tokenMachine/OTK");
const { log } = require("../../../services/logger/logger");
const { editUser } = require("../editUser/editUser");
const { prepareMail } = require("../../../services/mailer/actions");
const { sendMail } = require("../../../services/mailer/actions");

function checkSource(body) {
	if (Object.keys(body).includes("gumroad_fee")) {
		return "Gumroad";
	} else if (Object.keys(body).includes("sign")) {
		return "Tilda";
	}
	throw new Error("Unavailable payment source");
}

function getDateObject(date) {
	const timestamp = date ? Date.parse(date) : Date.mow();
	return new Date(timestamp);
}

function getISODateOny(date) {
	const dateObject = typeof date === "string" ? getDateObject(date) : date;
	return dateObject.toISOString().split("T")[0];
}

async function newPayment({ req, res }) {
	const products = {
		["_-jg_yvw1calvFhRDQaqJg=="]: "HSE",
		["DYGiKngRwU-N1dt_WOJ0lg=="]: "HSP",
	};
	const { body } = req;
	if (body.test) {
		res.sendStatus(200);
		return;
	}
	try {
		log.debug(body);
		const date = new Date(Date.now());

		const source = checkSource(body);
		const payment = { source, ts: Date.now() };
		switch (source) {
			case "Gumroad":
				Object.assign(payment, {
					date,
					email: body.email,
					firstName: body["First Name"],
					lastName: body["Last Name"],
					paymentId: body.sale_id,
					moduleId: products[body.product_id],
					value: body.price,
					currency: "USD",
				});
				break;
			case "Tilda":
				if (body.name) {
					const [firstName, lastName] = body.name.split(" ", 2);
					Object.assign(payment, {
						firstName,
						lastName,
					});
				}
				const moduleId = body.payment.products[0].sku.slice(0, 3);
				const isProlongation = body.payment.products[0].sku.includes("+");
				Object.assign(payment, {
					date,
					email: body.email,
					paymentId: body.payment.orderid,
					moduleId,
					isProlongation,
					value: body.payment.products[0].price,
					currency: "RUB",
				});
		}
		log.debug(payment);
		const user = await getDBRequest("getUserInfo", {
			query: { email: payment.email },
		});
		const moduleInfo = await getDBRequest("getModuleInfo", {
			query: { code: payment.moduleId.toUpperCase() },
		});
		let start = getISODateOny(date);
		if (body.start) {
			const dateArray = body.start.split(".");
			const startDateNormilized = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
			start = getISODateOny(startDateNormilized);
		}
		let deadline = calculateDeadline(start, 62);

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

			const createdUser = await createUser(newUser);

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
			await editUser({
				id: user?.id,
				data: { 
					[`modules.${payment?.moduleId}.deadline`]: deadline,
					[`modules.${payment?.moduleId}.prolongations`]: prolData 
				},
				type: "push",
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

			const newModule = {
				start,
				deadline,
				prolongations: [],
			};

			await editUser({
				id: user?.id,
				data: { [`modules.${payment?.moduleId}`]: newModule },
				type: "set",
			});

			for (const [id] of activeModules) {
				const type = id === payment?.moduleId ? "newBuy" : "otherModule";
				const data = {
					type,
					paymentId: payment.paymentId,
					until: deadline,
				};
				await editUser({
					id: user?.id,
					data: { 
						[`modules.${id}.deadline`]: deadline,
						[`modules.${id}.prolongations`]: data 
					},
					type: "push",
				});
			}

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
		return payment;
	} catch (e) {
		console.log("Error with processing new payment.\n", e);
		res.sendStatus(500);
	}
}

module.exports = { newPayment };
