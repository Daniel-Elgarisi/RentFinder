const express = require("express");
const router = express.Router();
const {
  updateUserDetails,
  getPhoneNumber,
} = require("../controllers/userController");

router.post("/update-details", updateUserDetails);
router.get("/get-PhoneNumber/:Email", getPhoneNumber);

module.exports = router;
