const nodemailer = require("nodemailer");

const { MAIL_USER, MAIL_PASS } = process.env;

const options = {
	pool: true,
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: MAIL_USER,
		pass: MAIL_PASS,
	},
};

const mailer = nodemailer.createTransport(options);

module.exports = { mailer };
