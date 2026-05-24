import { Link } from "react-router-dom"

function NotFound() {
  return (
    <div className="centered-page">
      <div className="message-card">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="muted">The page you requested does not exist in this workspace.</p>
        <Link className="primary-button inline-button" to="/">
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
