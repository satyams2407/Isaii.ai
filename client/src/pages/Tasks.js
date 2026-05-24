import { useEffect, useState } from "react"

import { apiRequest } from "../utils/api"
import { getUser } from "../utils/auth"

const emptyForm = {
  title: "",
  description: "",
  priority: "medium",
  assignedTo: "",
  dueDate: "",
}

function Tasks() {
  const user = getUser()
  const canManageTasks = ["admin", "manager"].includes(user?.role)

  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadPage() {
      try {
        const taskData = await apiRequest("/api/tasks")
        if (isMounted) {
          setTasks(taskData.tasks)
        }

        if (canManageTasks) {
          const userData = await apiRequest("/api/users/options")
          if (isMounted) {
            setUsers(userData.users)
          }
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadPage()

    return () => {
      isMounted = false
    }
  }, [canManageTasks])

  async function handleCreateTask(event) {
    event.preventDefault()
    setSaving(true)
    setError("")

    try {
      const data = await apiRequest("/api/tasks", {
        method: "POST",
        body: JSON.stringify(form),
      })

      setTasks((currentTasks) => [data.task, ...currentTasks])
      setForm(emptyForm)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(taskId, status) {
    try {
      const data = await apiRequest(`/api/tasks/${taskId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task._id === taskId ? data.task : task))
      )
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      await apiRequest(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })

      setTasks((currentTasks) => currentTasks.filter((task) => task._id !== taskId))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Workflow</p>
          <h2>Tasks</h2>
          <p className="muted">Create, assign, and track work across roles.</p>
        </div>
      </header>

      {error ? <p className="status-card error-text">{error}</p> : null}

      {canManageTasks ? (
        <form className="panel task-form" onSubmit={handleCreateTask}>
          <div className="panel-header">
            <h3>Create Task</h3>
          </div>

          <div className="form-grid">
            <label>
              Title
              <input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                required
              />
            </label>

            <label>
              Assign To
              <select
                value={form.assignedTo}
                onChange={(event) => setForm({ ...form, assignedTo: event.target.value })}
                required
              >
                <option value="">Select a user</option>
                {users.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name} ({option.role})
                  </option>
                ))}
              </select>
            </label>

            <label>
              Priority
              <select
                value={form.priority}
                onChange={(event) => setForm({ ...form, priority: event.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>

            <label>
              Due Date
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
              />
            </label>
          </div>

          <label>
            Description
            <textarea
              rows="4"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </label>

          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create Task"}
          </button>
        </form>
      ) : null}

      <div className="panel">
        <div className="panel-header">
          <h3>Task Board</h3>
          <span className="muted small">{tasks.length} items</span>
        </div>

        {loading ? <p className="muted">Loading tasks...</p> : null}

        {!loading && tasks.length === 0 ? (
          <p className="muted">No tasks found for this role yet.</p>
        ) : null}

        {!loading && tasks.length ? (
          <div className="task-list">
            {tasks.map((task) => (
              <article className="task-item stacked" key={task._id}>
                <div className="task-item-row">
                  <div>
                    <strong>{task.title}</strong>
                    <p className="muted small">{task.description || "No description provided"}</p>
                  </div>
                  <div className="task-meta">
                    <span className={`chip ${task.status}`}>{task.status.replace("_", " ")}</span>
                    <span className={`chip priority-${task.priority}`}>{task.priority}</span>
                  </div>
                </div>

                <div className="task-item-row">
                  <div className="muted small">
                    Assigned to {task.assignedTo?.name || "Unknown"} | Due{" "}
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}
                  </div>

                  <div className="action-row">
                    <select
                      value={task.status}
                      onChange={(event) => handleStatusChange(task._id, event.target.value)}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>

                    {canManageTasks ? (
                      <button
                        className="ghost-button danger"
                        onClick={() => handleDeleteTask(task._id)}
                        type="button"
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default Tasks
