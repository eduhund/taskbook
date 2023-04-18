const ru = require("./dicts/ru.json");
const langs = {
	ru,
};

function getPhrase(lang, intent) {
	const phrase = (langs[lang] ?? {})[intent];
	if (phrase) return phrase;
	throw new Error("Can't find a phrase with intent " + intent);
}

module.exports = getPhrase;
