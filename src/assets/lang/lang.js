const ru = require("./dicts/ru.json");
const langs = {
	ru,
};

function getDict(lang) {
	return (
		langs[lang] || new Error("Can't find a dictionary for selected language")
	);
}

function getPhrase(lang, intent) {
	try {
		const dict = getDict(lang);
		return (
			dict[intent] || new Error("Can't find a phrase with intent ", intent)
		);
	} catch (e) {
		throw new Error("Error with phrase generator: ", e);
	}
}

module.exports = getPhrase;
