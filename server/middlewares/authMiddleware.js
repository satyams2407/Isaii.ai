const { verifyToken } = require("../utils/auth")

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || ""

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" })
  }

  const token = authHeader.slice(7)

  try {
    req.user = verifyToken(token)
    next()
  } catch (error) {
    res.status(401).json({ message: error.message || "Invalid token" })
  }
}

module.exports = authMiddleware
