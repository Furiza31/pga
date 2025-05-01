import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import config from "./config/config";
import initializeDatabase from "./utils/db-init";

// Import routes
import authRoutes from "./routes/auth.routes";
import eventRoutes from "./routes/event.routes";
import forumRoutes from "./routes/forum.routes";
import projectRoutes from "./routes/project.routes";
import userRoutes from "./routes/user.routes";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log requests in development
if (config.server.nodeEnv === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/forum", forumRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).send({
    status: "ok",
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(err.status || 500).send({
      error: {
        message: err.message || "Internal Server Error",
        status: err.status || 500,
      },
    });
  }
);

// Handle undefined routes (404)
app.use("*", (req, res) => {
  res.status(404).json({
    error: {
      message: "Route not found",
      status: 404,
    },
  });
});

// Start server function
const startServer = async () => {
  try {
    // Initialize database
    const dbInitialized = await initializeDatabase();

    if (!dbInitialized) {
      console.error("Failed to initialize database. Server will not start.");
      process.exit(1);
    }

    // Start server
    const PORT = config.server.port;
    app.listen(PORT, () => {
      console.log(`✨ Server running on port ${PORT}`);
      console.log(`🚀 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
