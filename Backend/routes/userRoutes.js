const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/update-details", userController.updateUserDetails);

module.exports = router;
