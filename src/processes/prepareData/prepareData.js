const {
	calculateUserScore,
	calculateModuleMaxScore,
	calculateDoneTasks,
} = require("../../utils/calculators");

function prepareModuleData(data, isAuth) {
	const { module, state } = data;

	const content = {};

	const main = {
		id: module.code,
		name: module.name,
		shortName: module.shortName,
		description: module.description,
		lang: module.lang,
		moduleLink: module.moduleLink,
		features: module.features,
		mascot: module.mascot,
		price: module.price,
		buyLink: module.buyLink,
	};

	const { intro, final } = module;

	const lessons = Object.entries(module.lessons).map(([id, value]) => {
		return {
			id,
			title: value?.title,
			description: value?.description,
		};
	});
	const scoped = { intro, final, lessons };
	const progress = {
		score: calculateUserScore(state),
		maxScore: calculateModuleMaxScore(module.lessons),
		doneTasks: calculateDoneTasks(state),
		totalTasks: module.totalTasks,
	};
	Object.assign(content, main, isAuth && scoped, isAuth && progress);
	return content;
}

function prepareData(type, data, isAuth) {
	try {
		switch (type) {
			case "module":
				return prepareModuleData(data, isAuth);
		}
	} catch (e) {
		console.log(e);
	}
}

module.exports = prepareData;
