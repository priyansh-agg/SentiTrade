require("dotenv").config();

const cors = require("cors");
const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const http = require("http");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { corsOptions } = require("./config/cors");
const initSocket = require("./services/socketService");
const healthRoutes = require("./routes/healthRoutes");
const sentimentRoutes = require("./routes/sentimentRoutes");
const correlationRoutes = require("./routes/correlationRoutes");
const assetRoutes = require("./routes/assetRoutes");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);

app.use(helmet());
app.use(compression());
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(
  "/api",
  rateLimit({
    windowMs: 60 * 1000,
    limit: Number(process.env.RATE_LIMIT_PER_MINUTE || 120),
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/", (_req, res) => {
  res.json({
    name: "SentiTrade API",
    status: "running",
    health: "/api/health"
  });
});

app.use("/api", healthRoutes);
app.use("/api", assetRoutes);
app.use("/api", sentimentRoutes);
app.use("/api", correlationRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.message?.startsWith("CORS blocked") ? 403 : error.status || 500;

  res.status(status).json({
    message: error.message || "Internal server error"
  });
});

const start = async () => {
  await connectDB();
  initSocket(server);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();

const shutdown = (signal) => {
  console.log(`${signal} received. Closing server...`);
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

module.exports = { app, server };
