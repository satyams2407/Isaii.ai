require("dotenv").config()
const cors = require("cors")
const express = require("express")
const mongoose = require("mongoose")

const authRoutes = require("./routes/authRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")
const taskRoutes = require("./routes/taskRoutes")
const userRoutes = require("./routes/userRoutes")
const { errorHandler, notFound } = require("./middlewares/errorMiddleware")
const { ensureSeedAdmin } = require("./utils/seed")

const app = express()
const PORT = process.env.PORT || 5001

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)
app.use(express.json())

app.get("/api/health", (req, res) => {
  res.json({ message: "API is running" })
})

app.use("/api/auth", authRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/users", userRoutes)

app.use(notFound)
app.use(errorHandler)

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    await ensureSeedAdmin()

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error.message)
    process.exit(1)
  }
}

startServer()
