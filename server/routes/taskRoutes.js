const express = require("express")

const {
  createTask,
  deleteTask,
  listTasks,
  updateTaskStatus,
} = require("../controllers/taskController")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

const router = express.Router()

router.use(authMiddleware)

router.get("/", listTasks)
router.post("/", roleMiddleware("admin", "manager"), createTask)
router.patch("/:id/status", updateTaskStatus)
router.delete("/:id", roleMiddleware("admin", "manager"), deleteTask)

module.exports = router
