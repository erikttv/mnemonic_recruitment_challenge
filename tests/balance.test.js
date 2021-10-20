/** @format */

const request = require("supertest");
const { resource } = require("../app");
const app = require("../app");

describe("Testing feedback messages from server", () => {
	test("GET balance, should not be implemented", async () => {
		const response = await request(app).get("/api/balance");
		expect(response.statusCode).toBe(501);
	});
	test("POST negative amount", async () => {
		const response = await request(app).post("/api/balance").send({
			cashAmount: -300,
			sourceAccount: 3,
			destinationAccount: 2,
		});
		expect(response.statusCode).toBe(400);
		expect(response.body.message).toBe("Error: Amount was negative or zero");
	});
	test("POST to not existing account", async () => {
		const response = await request(app).post("/api/balance").send({
			cashAmount: 300,
			sourceAccount: 1000,
			destinationAccount: 2,
		});
		expect(response.statusCode).toBe(400);
		expect(response.body.message).toBe(
			"Error: Could not add transaction. Perhaps account does not exist."
		);
	});
	test("POST add 100 NOK from account 3 to 2", async () => {
		const response = await request(app).post("/api/balance").send({
			cashAmount: 100,
			sourceAccount: 3,
			destinationAccount: 2,
		});
		expect(response.statusCode).toBe(200);
		expect(response.body.message).toBe("Transaction successfull");
	});
});

//TODO: Connect to mysql and do queries to check
describe("Checking correct updates in db", () => {
	test("POST add 100 NOK from 2 to 3", async () => {
		const response = await request(app).post("/api/balance").send({});
	});
});
