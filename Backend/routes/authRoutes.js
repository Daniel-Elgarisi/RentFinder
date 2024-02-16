const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../DB");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

const saltRounds = 10;

async function register(req, res) {
  let { FirstName, LastName, Password, Email, PhoneNumber } = req.body;

  if (!FirstName || !LastName || !Password || !Email || !PhoneNumber) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields." });
  }

  db.get("SELECT * FROM Users WHERE Email = ?", [Email], async (err, user) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ message: "Error checking user existence." });
    }
    if (user) {
      return res.status(409).json({ message: "Email already exists." });
    } else {
      const hashedPassword = await bcrypt.hash(Password, saltRounds);

      db.run(
        "INSERT INTO Users (FirstName, LastName, Password, Email, PhoneNumber) VALUES (?, ?, ?, ?, ?)",
        [FirstName, LastName, hashedPassword, Email, PhoneNumber],
        function (err) {
          if (err) {
            console.error(err.message);
            return res
              .status(500)
              .json({ message: "Error registering new user." });
          }
          return res
            .status(201)
            .json({ message: "User successfully registered." });
        }
      );
    }
  });
}

async function login(req, res) {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res
      .status(400)
      .json({ message: "Please provide both email and password." });
  }

  db.get("SELECT * FROM Users WHERE Email = ?", [Email], async (err, user) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ message: "Error during user authentication." });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const passwordMatch = await bcrypt.compare(Password, user.Password);
    if (passwordMatch) {
      return res.status(200).json({
        Email: user.Email,
      });
    } else {
      return res.status(401).json({ message: "Incorrect password." });
    }
  });
}

module.exports = router;
