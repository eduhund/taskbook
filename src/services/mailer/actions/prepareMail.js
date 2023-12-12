const { applyTemplate } = require("../templates");

function prepareMail(context) {
	const { params, data } = context;
	return applyTemplate(params, data);
}

module.exports = prepareMail;