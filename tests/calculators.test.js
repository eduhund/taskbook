const {
	calculateMaxScore,
	calculateScore,
} = require("../src/utils/calculators");
const { readFileAsObject } = require("./utils/fileUtils");

describe("Calculate Max Score", () => {
	test.each([
		{ name: "Radio", taskFile: "data/taskRadio.json", score: 20 },
		{ name: "Select", taskFile: "data/taskSelect.json", score: 80 },
		{ name: "Checkbox", taskFile: "data/taskCheckbox.json", score: 60 },
		{ name: "Text", taskFile: "data/taskText.json", score: 100 },
		{ name: "Link", taskFile: "data/taskLink.json", score: 100 },
		{ name: "Choice", taskFile: "data/taskChoice.json", score: 400 },
	])("Calculate Max Score: $name", ({ name, taskFile, score }) => {
		var task = readFileAsObject(taskFile);

		expect(calculateMaxScore(task)).toBe(score);
	});
});

/*
describe("Calculate Score", () => {
	test.each([
		{
			name: "Radio",
			stateFile: "data/stateRadio.json",
			taskFile: "data/taskRadio.json",
			score: 20,
		},
		{
			name: "Select",
			stateFile: "data/stateSelect.json",
			taskFile: "data/taskSelect.json",
			score: 10,
		},
		{
			name: "Checkbox",
			stateFile: "data/stateCheckbox.json",
			taskFile: "data/taskCheckbox.json",
			score: 30,
		},
		{
			name: "Text",
			stateFile: "data/stateText.json",
			taskFile: "data/taskText.json",
			score: 100,
		},
		{
			name: "Text: too short",
			stateFile: "data/stateTextWrong.json",
			taskFile: "data/taskText.json",
			score: 0,
		},
		//          {name: 'Link', file: 'data/stateLink.json', score: 100},
		//          {name: 'Choice', file: 'data/stateChoice.json', score: }
	])("Calculate Score: $name", ({ name, stateFile, taskFile, score }) => {
		var task = readFileAsObject(taskFile);
		var state = readFileAsObject(stateFile);

		expect(calculateScore(state, task)).toBe(score);
	});
});
*/
