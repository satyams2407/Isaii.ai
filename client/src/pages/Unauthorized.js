import { Link } from "react-router-dom"

function Unauthorized() {
  return (
    <div className="centered-page">
      <div className="message-card">
        <p className="eyebrow">Access Denied</p>
        <h1>That area is restricted.</h1>
        <p className="muted">Your role does not have permission to open this page.</p>
        <Link className="primary-button inline-button" to="/dashboard">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default Unauthorized
