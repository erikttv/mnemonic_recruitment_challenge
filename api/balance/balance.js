/** @format */
const connectDB = require("../../connectdb");

function doTransaction(body, callBack) {
	var insertId;
	connection = connectDB.getConnection();
	connection.connect();
	connection.beginTransaction(function (err) {
		if (err) {
			connection.end();
			callBack({ message: "Error: Could not connect to db", status: 500 });
		}

		connection.query(
			"insert into transactions(registeredTime, cashAmount, sourceAccount, destinationAccount) values (?, ?, ?, ?);",
			[
				Date.now(),
				body.cashAmount,
				body.sourceAccount,
				body.destinationAccount,
			],
			function (error, results, fields) {
				if (error) {
					return connection.rollback(function () {
						connection.end();
						callBack({
							message:
								"Error: Could not add transaction. Perhaps account does not exist.",
							status: 400,
						});
					});
				}

				var log = "Post " + results.insertId + " added";
				console.log(log);
				insertId = results.insertId;
				connection.query(
					"update accounts set availableCash = availableCash - ? where accountId = ?;",
					[body.cashAmount, body.sourceAccount],
					function (error, results, fields) {
						if (error) {
							return connection.rollback(function () {
								connection.end();
								callBack({
									message: "Error: Not enough on account",
									status: 400,
									transactionId: insertId,
								});
							});
						}
						connection.query(
							"update accounts set availableCash = availableCash + ? where accountId = ?;",
							[body.cashAmount, body.destinationAccount],
							function (error, results, fields) {
								if (error) {
									return connection.rollback(function () {
										connection.end();
										callBack({
											message: "Error: Could not update account balance",
											status: 400,
											transactionId: insertId,
										});
									});
								}

								connection.query(
									"update transactions set success = 1, executedTime = ? where transactionId = ?",
									[Date.now(), insertId],
									function (error, results, fields) {
										if (error) {
											return connection.rollback(function () {
												connection.end();
												callBack({
													message: "Error: Could not update transaction",
													status: 400,
													transactionId: insertId,
												});
											});
										}
										connection.commit(function (err) {
											if (err) {
												return connection.rollback(function () {
													connection.end();
													callBack({
														message: "Error: Could not commit to db",
														status: 400,
														transactionId: insertId,
													});
												});
											}
											connection.end();
											callBack({
												message: "Transaction successfull",
												status: 200,
												transactionId: insertId,
											});
										});
									}
								);
							}
						);
					}
				);
			}
		);
	});
}

function addFailedTransaction(body, previousResponse, startTime, callBack) {
	let unixTimeNow = Date.now();
	let success = 0;
	connection = connectDB.getConnection();
	connection.connect();
	connection.beginTransaction(function (err) {
		if (err) {
			connection.end();
			callBack({
				message: "Error: Could not connect to ",
				status: 500,
			});
		}

		connection.query(
			"insert into transactions(registeredTime, executedTime, success, cashAmount, sourceAccount, destinationAccount) values (?, ?, ?, ?, ?, ?);",
			[
				startTime,
				unixTimeNow,
				0,
				body.cashAmount,
				body.sourceAccount,
				body.destinationAccount,
			],
			function (error, results, fields) {
				if (error) {
					return connection.rollback(function () {
						connection.end();
						console.log("inn");
						callBack({
							message: "Error: Could not insert failed transaction",
							status: 400,
						});
					});
				}

				connection.commit(function (err) {
					if (err) {
						return connection.rollback(function () {
							connection.end();
							callBack({
								message: "Error: Could not commit failed transaction",
								status: 400,
							});
						});
					}
					connection.end();
					callBack({
						message: "Saved failed transaction",
						status: 200,
					});
				});
			}
		);
	});
}

module.exports = {
	doTransaction,
	addFailedTransaction,
};
