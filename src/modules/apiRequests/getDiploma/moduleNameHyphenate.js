/**
 * @param {string} code
 * @returns {string}
 */
function hyphenate(code) {
	switch (code) {
		case "HSB":
			return "Hard Skills начинающего\nруководителя";
		case "MIO":
			return "Информационные\nожидания";
		case "TXT":
			return "Несекретные\nсекреты текстов";
		case "UCC":
			return "Сценарии\nвзаимодействия";
		case "COM":
			return "Композиция\nв дизайне интерфейсов";
		default:
			throw new Error("Module name with this code wasn't found!");
	}
}

module.exports = hyphenate;
