const Task = require("../models/Task")
const User = require("../models/User")

function buildTaskQuery(user) {
  if (user.role === "employee") {
    return { assignedTo: user.id }
  }

  return {}
}

async function listTasks(req, res, next) {
  try {
    const tasks = await Task.find(buildTaskQuery(req.user))
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 })

    res.json({ tasks })
  } catch (error) {
    next(error)
  }
}

async function createTask(req, res, next) {
  try {
    const { title, description, priority, dueDate, assignedTo } = req.body

    if (!title || !assignedTo) {
      return res.status(400).json({ message: "Title and assignee are required" })
    }

    const assignee = await User.findById(assignedTo)
    if (!assignee || !assignee.isActive) {
      return res.status(404).json({ message: "Assigned user was not found" })
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || "",
      priority: priority || "medium",
      dueDate: dueDate || null,
      assignedTo,
      createdBy: req.user.id,
    })

    const populatedTask = await task.populate("assignedTo", "name email role")

    res.status(201).json({
      message: "Task created successfully",
      task: populatedTask,
    })
  } catch (error) {
    next(error)
  }
}

async function updateTaskStatus(req, res, next) {
  try {
    const { status } = req.body
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    const isOwner = task.assignedTo.toString() === req.user.id
    const canManage = ["admin", "manager"].includes(req.user.role)

    if (!canManage && !isOwner) {
      return res.status(403).json({ message: "You cannot update this task" })
    }

    task.status = status || task.status
    await task.save()

    const populatedTask = await task.populate("assignedTo", "name email role")

    res.json({
      message: "Task updated successfully",
      task: populatedTask,
    })
  } catch (error) {
    next(error)
  }
}

async function deleteTask(req, res, next) {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    await task.deleteOne()

    res.json({ message: "Task deleted successfully" })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createTask,
  deleteTask,
  listTasks,
  updateTaskStatus,
}
