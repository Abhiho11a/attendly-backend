const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const registrationRoutes = require("./routes/registrationRoutes");
const healthRoutes = require("./routes/healthRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

/*
 * Security headers
 */
app.use(helmet());

/*
 * CORS
 *
 * Native Android apps do not depend on browser CORS,
 * but enabling CORS keeps the API usable from web-based
 * tools/admin interfaces later.
 */
app.use(
  cors({
    origin: true
  })
);

/*
 * JSON request body parser
 */
app.use(express.json({ limit: "10kb" }));

/*
 * Basic request logging
 */
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} ${req.method} ${req.originalUrl}`
  );

  next();
});

/*
 * Root endpoint
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    service: "Attendly Backend",
    message: "Attendly backend is running"
  });
});

/*
 * Health
 */
app.use(
  "/api/health",
  healthRoutes
);

/*
 * Registration API
 */
app.use(
  "/api/registrations",
  registrationRoutes
);

/*
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/*
 * Global error handler
 */
app.use(errorHandler);

module.exports = app;