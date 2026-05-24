import { Navigate } from "react-router-dom"

import { isAuthenticated } from "../utils/auth"

function Home() {
  return <Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />
}

export default Home
