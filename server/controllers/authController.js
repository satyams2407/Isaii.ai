const User = require("../models/User")
const { comparePassword, signToken } = require("../utils/auth")

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "This account is inactive" })
    }

    const isValidPassword = comparePassword(password, user.passwordHash)
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = signToken({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    })

    res.json({
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    })
  } catch (error) {
    next(error)
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ user: sanitizeUser(user) })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  me,
  sanitizeUser,
}
