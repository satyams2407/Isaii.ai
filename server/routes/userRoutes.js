const express = require("express")

const {
  createUser,
  listAssignableUsers,
  listUsers,
  toggleUserStatus,
  updateUserRole,
} = require("../controllers/userController")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

const router = express.Router()

router.use(authMiddleware)

router.get("/", roleMiddleware("admin"), listUsers)
router.get("/options", roleMiddleware("admin", "manager"), listAssignableUsers)
router.post("/", roleMiddleware("admin"), createUser)
router.patch("/:id/role", roleMiddleware("admin"), updateUserRole)
router.patch("/:id/status", roleMiddleware("admin"), toggleUserStatus)

module.exports = router
