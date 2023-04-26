const { log } = require("@logger");

const tasksChoiceProcessor = {
	getMaxScore: function () {
		return this.question?.variants?.reduce(
			(currentValue, variant) => currentValue + variant.price || 0,
			0
		);
	},
	getScore: function (state, isMultiply = true) {
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

		if (isMultiply) {
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
				(state?.state || []).find((variant) => variant.isRight == true)
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
			return state?.state?.value == this.question?.rightAnswer
				? this.question?.price
				: 0;
		}
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
