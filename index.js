/** @format */

const app = require("./app");
const port = 3000;

app.listen(port, function () {
	console.log(
		"Server activated, listening on: http://localhost:3000/api/balance"
	);
});

module.exports = app;
