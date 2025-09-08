const express = require("express")
const { body, validationResult } = require("express-validator")
const { User } = require("../models")
const { hashPassword, comparePassword, generateToken } = require("../utils/auth")

const router = express.Router()

// Signup route
router.post(
  "/signup",
  [
    body("name").trim().isLength({ min: 2, max: 255 }).withMessage("Name must be between 2 and 255 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          details: errors.array(),
        })
      }

      const { name, email, password } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        return res.status(409).json({ error: "User already exists with this email" })
      }

      // Hash password and create user
      const passwordHash = await hashPassword(password)
      const user = await User.create({
        name,
        email,
        passwordHash,
      })

      // Generate token
      const token = generateToken(user.id)

      res.status(201).json({
        message: "User created successfully",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
    } catch (error) {
      console.error("Signup error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  },
)

// Login route
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          details: errors.array(),
        })
      }

      const { email, password } = req.body

      // Find user by email
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" })
      }

      // Check password
      const isValidPassword = await comparePassword(password, user.passwordHash)
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid email or password" })
      }

      // Generate token
      const token = generateToken(user.id)

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  },
)

module.exports = router
