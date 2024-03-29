const { log } = require("@logger");

const tasksChoiceProcessor = {
	getMaxScore: function () {
		return this.question?.variants?.reduce(
			(currentValue, variant) => currentValue + variant.price || 0,
			0
		);
	},
	getScore: function (state, task) {
		const {multiply, hasRightAnswer} = task
		var variantsById = {};
		this.question?.variants?.forEach((variant) => {
			variantsById[variant.id] = variant;
		});

		if (
			!state?.state &&
			!(this.question?.variants || []).find(
				(variant) => variant.isRight == true
			)
		) {
			return this.question?.maxScore || 0;
		}

		if (hasRightAnswer === false) {
			return (
				(state?.state || []).find((variant) => variant.isRight == true && variant.isSelected == true)
					?.price || 0
			);
		}

		if (multiply) {
			return (state?.state || []).reduce((currentValue, variantState) => {
				var variant = variantsById[variantState.id];
				if (
					(variant?.isRight && variantState?.isSelected) ||
					(!variant?.isRight && !variantState?.isSelected)
				) {
					return currentValue + variant?.price;
				} else return currentValue;
			}, 0);
		} else {
			return (
				(state?.state || []).find((variant) => variant.isRight == true && variant.isSelected == true)
					?.price || 0
			);
		}
	},
};

const tasksTextProcessor = {
	getMaxScore: function () {
		return this.question?.price;
	},
	getScore: function (state) {
		if (this.question?.minLength) {
			return state?.state?.value?.length >= this.question?.minLength
				? this.question?.price
				: 0;
		}

		if (this.question?.rightAnswer) {
			return String(state?.state?.value).toLowerCase() ===
				String(this.question?.rightAnswer).toLowerCase()
				? this.question?.price
				: 0;
		}

		return this.question?.price;
	},
};

const errorProcessor = {
	getMaxScore: function () {
		log.warn("Unknown question type: " + this.question?.type);
		return 0;
	},
	getScore: function (state) {
		log.warn("Unknown question type: " + this.question?.type);
		return 0;
	},
};

const tasksDictionary = {
	checkbox: tasksChoiceProcessor,
	choice: tasksChoiceProcessor,
	radio: tasksChoiceProcessor,
	select: tasksChoiceProcessor,
	link: tasksTextProcessor,
	text: tasksTextProcessor,
};

function getTaskProcessor(question) {
	var processor = tasksDictionary[question?.type] || errorProcessor;
	return Object.assign({ question }, processor);
}

module.exports.getTaskProcessor = getTaskProcessor;
module.exports.tasksDictionary = tasksDictionary;
