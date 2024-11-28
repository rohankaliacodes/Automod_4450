const express = require("express");
const { signup, login, verifyEmail } = require("../controllers/authController");
const router = express.Router();

// Define routes

const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/protected", authenticateToken, (req, res) => {
  res.status(200).json({ message: "This is a protected route", user: req.user });
});

router.post("/signup", signup); // Signup route
router.post("/login", login); // Login route
router.get("/verify-email", verifyEmail); // Email verification route

module.exports = router;
