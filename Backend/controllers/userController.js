// userController.js

const bcrypt = require("bcrypt");
const db = require("../DB"); // Adjust the path as necessary

const saltRounds = 10;

exports.updateUserDetails = async (req, res) => {
  const { email, newPassword, newEmail, newPhoneNumber } = req.body;

  let queryParams = [];
  let updateFields = [];

  // Update email and phone number regardless; they are either changed or remain the same
  if (newEmail !== undefined) {
    updateFields.push(`Email = ?`);
    queryParams.push(newEmail);
  }

  if (newPhoneNumber !== undefined) {
    updateFields.push(`PhoneNumber = ?`);
    queryParams.push(newPhoneNumber);
  }

  // Only update the password if a new one is provided
  if (newPassword) {
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
  queryParams.push(email); // Assuming email is used as a unique identifier for WHERE clause

  try {
    db.run(updateQuery, queryParams, function (err) {
      if (err) {
        return res.status(500).send("Failed to update user details.");
      }
      if (this.changes > 0) {
        res.send("User details updated successfully.");
      } else {
        res.send("No user found with the provided identifier.");
      }
    });
  } catch (error) {
    res.status(500).send("Error updating user details.");
  }
};
