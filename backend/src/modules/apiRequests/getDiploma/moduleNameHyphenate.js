const dict = {
	ru: {
		HSB: "Hard Skills начинающего\nруководителя",
		MIO: "Информационные\nожидания",
		TXT: "Несекретные\nсекреты текстов",
		UCC: "Сценарии\nвзаимодействия",
		COM: "Композиция\nв дизайне интерфейсов",
		HSE: "Hard Skills начинающего\nруководителя",
		LGR: "Рассылки,\nкоторые читают",
	},
	en: {
		HSB: "Novice Manager\nHard Skills",
		MIO: "Informational\nexpectations",
		TXT: "Non-secret\nSecrets of Text Writing",
		UCC: "Use cases\nin Interface Design",
		COM: "Composition\nin Interface Design",
		HSE: "Hard Skills\nfor Managers",
		LGR: "Readable maillist",
	},
};

/**
 * @param {string} lang
 * @param {string} code
 * @returns {string}
 */
function hyphenate(lang, code) {
	if (dict[lang][code]) return dict[lang][code];
	throw new Error("Module name with this code wasn't found!");
}

module.exports = hyphenate;
