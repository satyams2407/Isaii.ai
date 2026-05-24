import { useEffect, useState } from "react"

import { apiRequest } from "../utils/api"

const defaultUserForm = {
  name: "",
  email: "",
  password: "",
  role: "employee",
}

function Users() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(defaultUserForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function loadUsers() {
    const data = await apiRequest("/api/users")
    setUsers(data.users)
  }

  useEffect(() => {
    let isMounted = true

    async function loadPage() {
      try {
        await loadUsers()
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
  }, [])

  async function handleCreateUser(event) {
    event.preventDefault()
    setSaving(true)
    setError("")

    try {
      const data = await apiRequest("/api/users", {
        method: "POST",
        body: JSON.stringify(form),
      })

      setUsers((currentUsers) => [data.user, ...currentUsers])
      setForm(defaultUserForm)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleRoleChange(userId, role) {
    try {
      const data = await apiRequest(`/api/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      })

      setUsers((currentUsers) =>
        currentUsers.map((user) => (user.id === userId ? data.user : user))
      )
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function handleStatusToggle(userId, isActive) {
    try {
      const data = await apiRequest(`/api/users/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
      })

      setUsers((currentUsers) =>
        currentUsers.map((user) => (user.id === userId ? data.user : user))
      )
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Administration</p>
          <h2>Users & Roles</h2>
          <p className="muted">Create accounts, assign roles, and control access.</p>
        </div>
      </header>

      {error ? <p className="status-card error-text">{error}</p> : null}

      <form className="panel task-form" onSubmit={handleCreateUser}>
        <div className="panel-header">
          <h3>Create User</h3>
        </div>

        <div className="form-grid">
          <label>
            Name
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>

          <label>
            Role
            <select
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        </div>

        <button className="primary-button" type="submit" disabled={saving}>
          {saving ? "Creating..." : "Create User"}
        </button>
      </form>

      <div className="panel">
        <div className="panel-header">
          <h3>Team Directory</h3>
        </div>

        {loading ? <p className="muted">Loading users...</p> : null}

        {!loading && users.length ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(event) => handleRoleChange(user.id, event.target.value)}
                      >
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={user.isActive}
                          onChange={(event) => handleStatusToggle(user.id, event.target.checked)}
                        />
                        <span>{user.isActive ? "Active" : "Inactive"}</span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default Users
