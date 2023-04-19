const ru = require("./dicts/ru.json");
const en = require("./dicts/en.json");
const langs = {
	ru,
	en,
};

function getPhrase(lang, intent) {
	const phrase = (langs[lang] ?? {})[intent];
	if (phrase) return phrase;
	throw new Error("Can't find a phrase with intent " + intent);
}

module.exports = getPhrase;
