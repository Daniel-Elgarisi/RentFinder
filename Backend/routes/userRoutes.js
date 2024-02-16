const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/update-details", userController.updateUserDetails);
router.get("/get-PhoneNumber/:Email", userController.getPhoneNumber);
module.exports = router;
