const getPhrase = require("../../../assets/lang/lang");
const colors = require("../../../assets/colors.json");
const hyphenate = require("./moduleNameHyphenate");

const locales = {
	ru: "ru-RU",
	en: "en-US",
};

function getCertType(progress = 0) {
	return progress >= 80
		? "certType++"
		: progress >= 60
		? "certType+"
		: "certType";
}

function processTexts(lang, moduleId, certType, certDate) {
	const date = new Date(certDate || "2023-01-01")
		.toLocaleDateString(locales[lang], {
			day: "numeric",
			month: "long",
			year: "numeric",
		})
		.replace(" г.", "");
	return {
		moduleName: hyphenate(moduleId),
		certDescription: getPhrase(lang, "certDescription"),
		certType: getPhrase(lang, certType),
		certCheck1: getPhrase(lang, "certCheck1"),
		certCheck2: getPhrase(lang, "certCheck2"),
		certSignName: getPhrase(lang, "certSignName"),
		certSignPos: getPhrase(lang, "certSignPos"),
		certDate: date,
	};
}

function processColors(moduleId, progress, params) {
	console.log(params);
	const { isColor, isMascot, isProgress } = params;
	const bgColor = isColor ? colors[moduleId]?.primary : "#FFFFFF";

	let primaryColor;
	if (moduleId === "MIO") {
		primaryColor = isColor ? "#000000" : colors[moduleId]?.primary;
	} else {
		primaryColor = isColor ? "#FFFFFF" : colors[moduleId]?.primary;
	}

	const textColor = !isColor || moduleId === "MIO" ? "#101010" : "#FFFFFF";
	const signColor = !isColor || moduleId === "MIO" ? "b" : "w";
	const skillOpacity = isProgress
		? isColor
			? moduleId === "MIO"
				? "0.6"
				: "0.77"
			: "1"
		: "0";
	const mascotOpacity =
		!isMascot || isColor ? "0" : progress >= 60 ? "1" : "0.3";
	const progressOpacity = isProgress ? (progress >= 60 ? "1" : "0.3") : "0";
	const headerOpacity = progress < 60 ? "0.1" : "1";

	return {
		bgColor,
		primaryColor,
		textColor,
		signColor,
		skillOpacity,
		mascotOpacity,
		progressOpacity,
		headerOpacity,
	};
}

function provideData(data, params) {
	const { moduleId, progress, certDate } = data;
	const { lang } = params;

	const certType = getCertType(progress);

	const textData = processTexts(lang, moduleId, certType, certDate);
	const colorData = processColors(moduleId, progress, params);

	return {
		...data,
		...textData,
		...colorData,
	};
}

module.exports = provideData;
