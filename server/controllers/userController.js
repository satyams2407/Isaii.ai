const User = require("../models/User")
const { sanitizeUser } = require("./authController")
const { hashPassword } = require("../utils/auth")

async function listUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 })

    res.json({
      users: users.map(sanitizeUser),
    })
  } catch (error) {
    next(error)
  }
}

async function listAssignableUsers(req, res, next) {
  try {
    const users = await User.find({ isActive: true })
      .select("name email role")
      .sort({ name: 1 })

    res.json({ users })
  } catch (error) {
    next(error)
  }
}

async function createUser(req, res, next) {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const existingUser = await User.findOne({ email: normalizedEmail })

    if (existingUser) {
      return res.status(409).json({ message: "A user with this email already exists" })
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      role: role || "employee",
    })

    res.status(201).json({
      message: "User created successfully",
      user: sanitizeUser(user),
    })
  } catch (error) {
    next(error)
  }
}

async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.role = role || user.role
    await user.save()

    res.json({
      message: "User role updated successfully",
      user: sanitizeUser(user),
    })
  } catch (error) {
    next(error)
  }
}

async function toggleUserStatus(req, res, next) {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.isActive = typeof req.body.isActive === "boolean" ? req.body.isActive : !user.isActive
    await user.save()

    res.json({
      message: "User status updated successfully",
      user: sanitizeUser(user),
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createUser,
  listAssignableUsers,
  listUsers,
  toggleUserStatus,
  updateUserRole,
}
