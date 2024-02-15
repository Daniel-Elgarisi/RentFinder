require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const dbName = process.env.DB_NAME;

const db = new sqlite3.Database(dbName, (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

module.exports = db;
