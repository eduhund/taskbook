const request = require("supertest");
const { getApiRequest } = require("../src/modules/apiRequests/apiRequests");
const { readFileAsObject } = require("./utils/fileUtils");
const baseURL = `http://localhost:${process.env.SERVER_PORT}`;

describe("Auth", () => {
	beforeAll(async () => {
		await request(baseURL).post("/auth").send(newTodo);
	});
	test.each([
		{
			name: "not a user",
			dataFile: "auth/notAUser.json",
			result: {
				OK: false,
				error: {
					code: 10101,
					description: "User didn't found",
					type: "invalid_credentials",
				},
			},
		},
		{
			name: "wrong pass",
			dataFile: "auth/wrongPass.json",
			result: {
				OK: false,
				error: {
					code: 10102,
					description: "Invalid password",
					type: "invalid_credentials",
				},
			},
		},
	])("Try to auth — $name", async ({ dataFile, result }) => {
		var data = readFileAsObject(dataFile);

		const response = await getApiRequest("auth", data);
		expect(response).toEqual(result);
	});
});
