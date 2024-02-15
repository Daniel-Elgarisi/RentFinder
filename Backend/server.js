require("dotenv").config();
const fs = require("fs");
const https = require("https");
const express = require("express");
const db = require("./DB");
const app = express();

const authRoutes = require("./routes/authRoutes");

const httpsOptions = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello from RentFinder Backend!");
});

app.get("/users", (req, res) => {
  db.all(
    "SELECT FirstName, LastName, Password, Email, PhoneNumber FROM Users",
    [],
    (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Error fetching users from database");
      } else {
        res.json(rows);
      }
    }
  );
});

const port = process.env.PORT || 5000;
https.createServer(httpsOptions, app).listen(port, () => {
  console.log(`HTTPS server running on port ${port}`);
});
