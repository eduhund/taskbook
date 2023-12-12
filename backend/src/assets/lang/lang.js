const ru = require("./dicts/ru.json");
const en = require("./dicts/en.json");
const langs = {
	ru,
	en,
};

function setString(phrase, values = {}) {
	const prefix = "{{";
	const suffix = "}}";

	let string = phrase;
	for (key in values) {
		string = string.replaceAll(prefix + key + suffix, values[key]);
	}
	return string;
}

function getPhrase(lang, intent, data = {}) {
	const phrase = (langs[lang] ?? {})[intent];
	if (!phrase) {
		throw new Error("Can't find a phrase with intent " + intent);
	}
	if (Object.keys(data).length > 0) {
		return setString(phrase, data);
	}
	return phrase;
}

module.exports = getPhrase;
