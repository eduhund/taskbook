const { mailer } = require("../mailer");

const { MAIL_FROM } = process.env;

function sendMail(mail, to, subject) {
	mailer.sendMail({
		from: MAIL_FROM,
		to,
		subject,
		html: mail,
	});
}

module.exports = sendMail;
