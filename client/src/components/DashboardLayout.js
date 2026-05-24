import { NavLink, Outlet, useNavigate } from "react-router-dom"

import { clearAuth, getUser } from "../utils/auth"

function DashboardLayout() {
  const navigate = useNavigate()
  const user = getUser()

  const navItems = [
    { label: "Dashboard", to: "/dashboard", roles: ["admin", "manager", "employee"] },
    { label: "Tasks", to: "/tasks", roles: ["admin", "manager", "employee"] },
    { label: "Users", to: "/users", roles: ["admin"] },
  ]

  const visibleItems = navItems.filter((item) => item.roles.includes(user?.role))

  function handleLogout() {
    clearAuth()
    navigate("/login")
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Isaii Workspace</p>
          <h1>Ops Dashboard</h1>
          <p className="muted">Secure role-based admin starter for your MERN workflow.</p>
        </div>

        <nav className="nav">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="profile-card">
          <p className="muted small">Signed in as</p>
          <strong>{user?.name}</strong>
          <span className="role-badge">{user?.role}</span>
          <button className="ghost-button" onClick={handleLogout} type="button">
            Logout
          </button>
        </div>
      </aside>

      <main className="content-area">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
