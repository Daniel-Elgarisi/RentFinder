require("dotenv").config();
const express = require("express");
const db = require("./DB");
const app = express();
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", (_, res) => {
  res.send("Hello from RentFinder Backend!");
});

app.get("/users", (_, res) => {
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

app.listen(port, () => {
  console.log(`HTTP Server running on port ${port}`);
});
