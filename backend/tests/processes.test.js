const { checkCredentials, authUser } = require("../src/processes/processes");

describe("Check credentials process", () => {
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

	test("Wrong email", async () => {
		const expectedResponse = {
			OK: false,
			error: {
				code: 10101,
				type: "invalid_credentials",
				description: "User didn't found",
			},
		};
		mockRequest = {
			body: {
				email: "exapmle@mail.com",
				pass: "123",
			},
		};
		checkCredentials(mockRequest, mockResponse, nextFunction);

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
		checkParams(mockRequest, mockResponse, nextFunction);

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
		checkParams(mockRequest, mockResponse, nextFunction);

		expect(nextFunction).toBeCalledTimes(1);
	});
});
