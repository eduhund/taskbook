const prepareRequestData = require("../src/utils/prepareRequestData");

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
		prepareRequestData(mockRequest, mockResponse, nextFunction);

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
		prepareRequestData(mockRequest, mockResponse, nextFunction);

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
				email: "test@mail.com",
			},
		};
		prepareRequestData(mockRequest, mockResponse, nextFunction);

		expect(mockResponse.json).toBeCalledWith(expectedResponse);
	});

	test("all required params", async () => {
		mockRequest = {
			path: "/v3/students/echo",
			query: {
				email: "test@mail.com",
				pass: "123",
			},
		};
		prepareRequestData(mockRequest, mockResponse, nextFunction);

		expect(nextFunction).toBeCalledTimes(1);
	});
});
