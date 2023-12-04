const fs = require("fs");
const path = require("path");

const templatePath = path.join(__dirname, "templates");

function getTemplatesList() {
	return fs.readdirSync(templatePath);
}

function getTemplate({ lang, status, type, start }) {
	const nameArray = [lang, status];
	if (type) {
		nameArray.push(type);
	}
	if (start) {
		nameArray.push(start);
	}
	const name = nameArray.join("_") + ".html";
	return fs.readFileSync(path.join(templatePath, name)).toString();
}

function applyTemplate(params, data = {}) {
	let template = getTemplate(params);

	const prefix = "*|";
	const suffix = "|*";

	for (const key in data) {
		template = template.replaceAll(prefix + key + suffix, data[key]);
	}

	return template;
}

module.exports = { getTemplatesList, getTemplate, applyTemplate };
