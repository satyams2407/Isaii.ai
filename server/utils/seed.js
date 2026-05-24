const User = require("../models/User")
const { hashPassword } = require("./auth")

async function ensureSeedAdmin() {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@isaii.com").toLowerCase().trim()
  const existingAdmin = await User.findOne({ email: adminEmail })

  if (existingAdmin) {
    return
  }

  await User.create({
    name: process.env.ADMIN_NAME || "System Admin",
    email: adminEmail,
    passwordHash: hashPassword(process.env.ADMIN_PASSWORD || "admin12345"),
    role: "admin",
    isActive: true,
  })

  console.log(`Seeded admin user: ${adminEmail}`)
}

module.exports = {
  ensureSeedAdmin,
}
