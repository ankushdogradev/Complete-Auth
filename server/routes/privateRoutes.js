const express = require("express");
const router = express.Router();

const { private } = require("../controllers/privateControllers");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, private);

module.exports = router;
