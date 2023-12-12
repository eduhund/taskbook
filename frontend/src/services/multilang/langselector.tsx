const { RU } = require("./dictionaries/ru");
const { EN } = require("./dictionaries/en");

const LANGS: any = {
	ru: RU,
	en: EN,
};

const DEFAULT_LANG = process.env.REACT_APP_DEFAULT_LANG || "en";

function getRule(number: number, titles: any) {
	number = Math.abs(number);
	const cases: any = [2, 0, 1, 1, 1, 2];
	const phrase =
		titles[
			number % 100 > 4 && number % 100 < 20
				? 2
				: cases[number % 10 < 5 ? number % 10 : 5]
		];
	return `${number} ${phrase}`;
}

function setString(lang: string = DEFAULT_LANG, id: string, values: any = {}) {
	const prefix = "{{";
	const suffix = "}}";

	var string = selectLang(lang, id);
	var len = string?.length;
	if (!len || len === 0) {
		return;
	}
	var startIndex = 0;
	while (startIndex < string.length) {
		var prefixIndex = string.indexOf(prefix, startIndex);
		if (prefixIndex < 0) break;
		startIndex = prefixIndex + prefix.length;
		var suffixIndex = string.indexOf(suffix, startIndex);
		if (suffixIndex < 0) break;
		var identifier = string.slice(startIndex, suffixIndex);
		var value = values[identifier];
		if (identifier === "days" && lang === "ru") {
			value = getRule(value, ["день", "дня", "дней"]);
		}
		if (identifier === "doneTasks" && lang === "ru") {
			value = getRule(value, ["задача", "задачи", "задач"]);
		}

		if (identifier === "days" && lang === "en") {
			value = `${value} ${value === 1 ? "day" : "days"}`;
		}
		if (identifier === "totalTasks" && lang === "en") {
			value = `${value} ${value === 1 ? "problem" : "problems"}`;
		}
		string = string.replaceAll(prefix + identifier + suffix, value);
	}
	return string;
}

function selectLang(lang: string, string: string) {
	if (lang in LANGS) {
		return LANGS[lang][string];
	} else return LANGS[DEFAULT_LANG][string];
}

export { setString };
