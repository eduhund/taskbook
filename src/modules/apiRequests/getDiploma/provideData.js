const getPhrase = require("../../../assets/lang/lang");
const colors = require("../../../assets/colors.json");
const hyphenate = require("./moduleNameHyphenate");

const locales = {
	ru: "ru-RU",
	en: "en-US",
};

function getCertType(progress = 0) {
	let type = "certType";
	if (progress >= 60) {
		type + "+";
	}
	if (progress >= 80) {
		type + "+";
	}
	return type;
}

function provideData(data, params) {
	const module = data.moduleId;
	const { lang, colored, mascot, progress } = params;
	data.bgColor = colored ? colors[module]?.primary || "#101010" : "#FFFFFF";
	data.primaryColor =
		colored && module !== "MIO" ? "#FFFFFF" : colors[module]?.primary;
	data.textColor = module === "MIO" || !colored ? "#101010" : "#FFFFFF";
	data.headerOpacity = data?.progress < 60 ? "0.1" : "1";

	if (colored && module !== "MIO") {
		data.skillOpacity = "0.77";
	} else if (colored && module === "MIO") {
		data.skillOpacity = "0.6";
	} else if (!progress) {
		data.skillOpacity = "0";
	} else data.skillOpacity = "1";

	if (mascot && !colored && data?.progress >= 60) {
		data.mascotOpacity = "1";
	} else if (mascot && !colored && data?.progress < 60) {
		data.mascotOpacity = "0.3";
	} else data.mascotOpacity = "0";

	if (progress && data?.progress >= 60) {
		data.progressOpacity = "1";
	} else if (progress && data?.progress < 60) {
		data.progressOpacity = "0.3";
	} else data.progressOpacity = "0";

	const certType = getCertType(data.progress);

	data.certDate = new Date(data.certDate || "2023-01-01")
		.toLocaleDateString(locales[lang], {
			day: "numeric",
			month: "long",
			year: "numeric",
		})
		.replace(" г.", "");

	data.signColor = !colored || module === "MIO" ? "b" : "w";

	data.moduleName = hyphenate(module);
	data.certDescription = getPhrase(lang, "certDescription");
	data.certType = getPhrase(lang, certType);
	data.certCheck1 = getPhrase(lang, "certCheck1");
	data.certCheck2 = getPhrase(lang, "certCheck2");
	data.certSignName = getPhrase(lang, "certSignName");
	data.certSignPos = getPhrase(lang, "certSignPos");

	return data;
}

module.exports = provideData;
