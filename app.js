/** @format */
const balance = require("./api/balance/balance.js");
const express = require("express");
const app = express();
app.use(express.json());

/* Thoughts:
 * - Easy to add more api endpoints. Just add files to api/{endpoint}.
 * - Balance requires precision with the transactions taken and is complex.
 * - Vipps has more complexity, at least in consumer world. Must reserve amount and add later.
 * - Weakness: does only reckognise accounts already registered in db
 * - AccountId 1 is designated for admin.
 * - Testing should be focused on endpoints as well as checking the db to see if correct amount is transferred.
 * - Id is only for db, but want to use a more complex one such as account number.
 */

app.get("/api/balance", async function (req, res) {
	res.status(501);
	res.json({
		message: "Not implemented",
		status: 501,
	});
});

app.post("/api/balance", function (req, res) {
	// Cannot be a negative amount
	let unitTime = Date.now();
	if (req.body.cashAmount <= 0) {
		res.status(400);
		res.json({
			message: "Error: Amount was negative or zero",
			status: 400,
		});
		return;
	}

	//TODO: implement other check criteria
	balance.doTransaction(req.body, function (responseTransaction) {
		let body = req.body;
		if (responseTransaction.status == 200) {
			res.json({ ...responseTransaction, body });
		} else {
			balance.addFailedTransaction(
				body,
				responseTransaction,
				unitTime,
				(responseFailedTransaction) => {
					if ((responseFailedTransaction.status = 400)) {
						res.status(400);
						res.json({ ...responseTransaction, body });
					}
				}
			);
		}
	});
});

module.exports = app;
