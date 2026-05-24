import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { setAuth } from "../utils/auth"
import { apiRequest } from "../utils/api"

const initialForm = {
  email: "",
  password: "",
}

function Login() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError("")

    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      })

      setAuth(data.token, data.user)
      navigate(location.state?.from || "/dashboard", { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  function fillDemoCredentials() {
    setForm({
      email: "admin@isaii.com",
      password: "admin12345",
    })
  }

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div>
          <h1>Login</h1>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="admin@isaii.com"
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Enter password"
              required
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <button className="ghost-button" type="button" onClick={fillDemoCredentials}>
          Use seeded admin credentials
        </button>
      </div>
    </div>
  )
}

export default Login
