/** @format */

const mysql = require("mysql");
function getConnection() {
	return (connection = mysql.createConnection({
		host: "localhost",
		user: "user",
		password: "Passord1!",
		database: "mnemonic",
	}));
}

module.exports = {
	getConnection,
};
