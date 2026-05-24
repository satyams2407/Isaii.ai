import { useEffect, useState } from "react"

import { apiRequest } from "../utils/api"
import { getUser } from "../utils/auth"

function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const user = getUser()

  useEffect(() => {
    let isMounted = true

    async function loadSummary() {
      try {
        const data = await apiRequest("/api/dashboard/summary")

        if (isMounted) {
          setSummary(data)
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

    loadSummary()

    return () => {
      isMounted = false
    }
  }, [])

  const stats = [
    { label: "Total Tasks", value: summary?.stats?.totalTasks ?? 0 },
    { label: "To Do", value: summary?.stats?.todoTasks ?? 0 },
    { label: "In Progress", value: summary?.stats?.inProgressTasks ?? 0 },
    { label: "Done", value: summary?.stats?.doneTasks ?? 0 },
  ]

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>{user?.role === "admin" ? "Admin Dashboard" : "Dashboard"}</h2>
          <p className="muted">Track team activity, monitor workload, and move tasks forward.</p>
        </div>
      </header>

      {loading ? <p className="status-card">Loading dashboard...</p> : null}
      {error ? <p className="status-card error-text">{error}</p> : null}

      {!loading && !error ? (
        <>
          <div className="stats-grid">
            {stats.map((stat) => (
              <article className="stat-card" key={stat.label}>
                <p className="muted small">{stat.label}</p>
                <strong>{stat.value}</strong>
              </article>
            ))}
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Recent Tasks</h3>
              <span className="role-badge">{summary?.role}</span>
            </div>

            {summary?.recentTasks?.length ? (
              <div className="task-list">
                {summary.recentTasks.map((task) => (
                  <div className="task-item" key={task._id}>
                    <div>
                      <strong>{task.title}</strong>
                      <p className="muted small">{task.description || "No description provided"}</p>
                    </div>
                    <div className="task-meta">
                      <span className={`chip ${task.status}`}>{task.status.replace("_", " ")}</span>
                      <span className={`chip priority-${task.priority}`}>{task.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">No tasks yet. Create one from the tasks page.</p>
            )}
          </div>
        </>
      ) : null}
    </section>
  )
}

export default Dashboard
