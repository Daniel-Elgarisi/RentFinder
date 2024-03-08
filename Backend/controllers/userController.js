const bcrypt = require("bcrypt");
const db = require("../DB");

const saltRounds = 10;

const updateUserDetails = async (req, res) => {
  const { email, newPassword, newPhoneNumber } = req.body;

  let queryParams = [];
  let updateFields = [];

  if (newPhoneNumber) {
    updateFields.push(`PhoneNumber = ?`);
    queryParams.push(newPhoneNumber);
  }

  if (newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    updateFields.push(`Password = ?`);
    queryParams.push(hashedPassword);
  }

  if (updateFields.length === 0) {
    return res.status(400).send("No updates provided.");
  }

  queryParams.push(email);
  let updateQuery = `UPDATE Users SET ${updateFields.join(
    ", "
  )} WHERE Email = ?`;

  db.run(updateQuery, queryParams, function (err) {
    if (err) {
      console.error("Failed to update user details:", err.message);
      return res.status(500).send("Failed to update user details.");
    }
    if (this.changes > 0) {
      res.send("User details updated successfully.");
    } else {
      res.status(404).send("No user found with the provided email.");
    }
  });
};

const getPhoneNumber = (req, res) => {
  const email = req.params.Email;

  if (!email) {
    return res.status(400).json({ message: "Email not provided" });
  }

  const sql = `SELECT PhoneNumber FROM Users WHERE Email = ?`;

  db.get(sql, [email], (err, row) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ message: "An error occurred: " + err.message });
    }
    if (!row) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ PhoneNumber: row.PhoneNumber });
  });
};

module.exports = {
  updateUserDetails,
  getPhoneNumber,
};
