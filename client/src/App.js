import { Navigate, Route, Routes } from "react-router-dom"

import DashboardLayout from "./components/DashboardLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import RoleRoute from "./components/RoleRoute"
import Dashboard from "./pages/Dashboard"
import Home from "./pages/Home"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import Tasks from "./pages/Tasks"
import Unauthorized from "./pages/Unauthorized"
import Users from "./pages/Users"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/users" element={<Users />} />
          </Route>
        </Route>
      </Route>

      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
