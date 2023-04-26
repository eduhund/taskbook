const { checkParams } = require("../src/processes/processes");

describe("Check params middleware", () => {
	let mockRequest;
	let mockResponse;
	let nextFunction = jest.fn();

	beforeEach(() => {
		mockRequest = {};
		mockResponse = {
			status: jest.fn(),
			json: jest.fn(),
		};
	});

	test("without params, no required", async () => {
		mockRequest = {
			path: "/v3/students/echo",
			query: {},
		};
		checkParams(mockRequest, mockResponse, nextFunction);

		expect(nextFunction).toBeCalledTimes(1);
	});

	test("without params, have required", async () => {
		const expectedResponse = {
			OK: false,
			error: {
				code: 10001,
				description: "Missing required params",
				type: "invalid_request",
			},
		};
		mockRequest = {
			path: "/v3/students/auth",
			query: {},
		};
		checkParams(mockRequest, mockResponse, nextFunction);

		expect(mockResponse.json).toBeCalledWith(expectedResponse);
	});

	test("not all params, have required", async () => {
		const expectedResponse = {
			OK: false,
			error: {
				code: 10001,
				description: "Missing required params",
				type: "invalid_request",
			},
		};
		mockRequest = {
			path: "/v3/students/auth",
			query: {
				email: "mail@example.com",
			},
		};
		checkParams(mockRequest, mockResponse, nextFunction);

		expect(mockResponse.json).toBeCalledWith(expectedResponse);
	});

	test("all required params", async () => {
		mockRequest = {
			path: "/v3/students/echo",
			query: {
				email: "mail@example.com",
				pass: "111",
			},
		};
		checkParams(mockRequest, mockResponse, nextFunction);

		expect(nextFunction).toBeCalledTimes(1);
	});
});
