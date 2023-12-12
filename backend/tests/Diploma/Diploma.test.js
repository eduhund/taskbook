const provideData = require("../../src/modules/apiRequests/getDiploma/provideData");

const dataFile = require("./testData.json");

describe("Provide diploma data", () => {
	test.each(dataFile)("Variant: $name", ({ input, output }) => {
		const { data, params } = input;
		expect(provideData(data, params)).toMatchObject(output);
	});
});
