require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (_, res) => {
  res.send("Hello from RentFinder Backend!");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`HTTP Server running on port ${port}`);
});
