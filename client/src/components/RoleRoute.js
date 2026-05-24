import { Navigate, Outlet } from "react-router-dom"

import { hasRole } from "../utils/auth"

function RoleRoute({ allowedRoles }) {
  if (!hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default RoleRoute
