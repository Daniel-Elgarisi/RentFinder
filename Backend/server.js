require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const apartmentRoutes = require("./routes/apartmentRoutes");

const app = express();

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/apartments", apartmentRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`HTTP Server running on port ${port}`);
});
