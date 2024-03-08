const bcrypt = require("bcrypt");
const db = require("../DB");

const saltRounds = 10;

exports.updateUserDetails = async (req, res) => {
  const { email, newPassword, newPhoneNumber } = req.body;

  let queryParams = [];
  let updateFields = [];

  if (newPhoneNumber) {
    // Check if newPhoneNumber is truthy to prevent empty updates
    updateFields.push(`PhoneNumber = ?`);
    queryParams.push(newPhoneNumber);
  }

  if (newPassword) {
    // Check if newPassword is truthy to prevent empty updates
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    updateFields.push(`Password = ?`);
    queryParams.push(hashedPassword);
  }

  if (updateFields.length === 0) {
    return res.status(400).send("No updates provided.");
  }

  let updateQuery = `UPDATE Users SET ${updateFields.join(
    ", "
  )} WHERE Email = ?`;
  queryParams.push(email);

  try {
    db.run(updateQuery, queryParams, function (err) {
      if (err) {
        console.error("Failed to update user details:", err.message);
        return res.status(500).send("Failed to update user details.");
      }
      if (this.changes > 0) {
        res.send("User details updated successfully.");
      } else {
        res.send("No user found with the provided email.");
      }
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).send("Error updating user details.");
  }
};

exports.getPhoneNumber = (req, res) => {
  const Email = req.params.Email;

  if (!Email) {
    return res.status(400).json({ message: "Email not provided" });
  }

  const sql = `SELECT PhoneNumber FROM Users WHERE Email = ?`;

  return new Promise((resolve, reject) => {
    db.get(sql, [Email], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        resolve(row.PhoneNumber);
      } else {
        reject(new Error("User not found"));
      }
    });
  })
    .then((PhoneNumber) => {
      res.status(200).json({ PhoneNumber: PhoneNumber });
    })
    .catch((err) => {
      console.log(err.message);
      if (err.message === "User not found") {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(500).json({ message: "An error occurred: " + err.message });
      }
    });
};
