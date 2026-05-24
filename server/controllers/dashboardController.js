const Task = require("../models/Task")

function getScopedQuery(user) {
  if (user.role === "employee") {
    return { assignedTo: user.id }
  }

  return {}
}

async function getSummary(req, res, next) {
  try {
    const query = getScopedQuery(req.user)
    const [totalTasks, todoTasks, inProgressTasks, doneTasks, recentTasks] =
      await Promise.all([
        Task.countDocuments(query),
        Task.countDocuments({ ...query, status: "todo" }),
        Task.countDocuments({ ...query, status: "in_progress" }),
        Task.countDocuments({ ...query, status: "done" }),
        Task.find(query)
          .populate("assignedTo", "name email role")
          .sort({ createdAt: -1 })
          .limit(5),
      ])

    res.json({
      stats: {
        totalTasks,
        todoTasks,
        inProgressTasks,
        doneTasks,
      },
      recentTasks,
      role: req.user.role,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getSummary,
}
