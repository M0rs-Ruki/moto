import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";
import { securityHeaders, sanitizeInputs } from "./middleware/security";
import {
  requestLogger,
  performanceMonitor as performanceMiddleware,
} from "./middleware/requestLogger";
import { rateLimiter } from "./middleware/rateLimiter";
import routes from "./routes";
import { rabbitMQService } from "./services/rabbitmq.service";
import { RabbitMQQueueService } from "./services/rabbitmq-queue.service";
import { rabbitmqConsumerService } from "./services/rabbitmq-consumer.service";
import { logger } from "./utils/logger";
import { gracefulShutdown } from "./utils/gracefulShutdown";
import { configValidator } from "./config/validator";
import { performanceMonitor } from "./utils/performanceMonitor";
import { memoryMonitor } from "./utils/memoryMonitor";
import {
  healthCheck,
  simpleHealthCheck,
  readinessCheck,
  livenessCheck,
} from "./utils/healthCheck";

// Validate configuration before starting
if (!configValidator.validateAndLog()) {
  logger.error("Configuration validation failed. Exiting...");
  process.exit(1);
}

const app: Express = express();
const PORT = process.env.PORT || 8000;
const isProduction = process.env.NODE_ENV === "production";

// Trust proxy (important for rate limiting behind reverse proxy)
app.set("trust proxy", 1);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: isProduction ? 86400 : 0, // Cache preflight for 24h in production
};

// Security middleware (should be first)
app.use(securityHeaders);
app.disable("x-powered-by");

// Body parsing middleware with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// CORS
app.use(cors(corsOptions));

// Input sanitization
app.use(sanitizeInputs);

// Request logging and performance monitoring
if (isProduction) {
  app.use(requestLogger);
  app.use(performanceMiddleware(2000)); // Warn if request takes > 2s
} else {
  // Simple logging for development
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
  });
}

// Rate limiting (global)
if (isProduction) {
  app.use(rateLimiter.middleware());
}

// Health check endpoints (no rate limiting)
app.get("/health", simpleHealthCheck);
app.get("/health/detailed", healthCheck);
app.get("/health/ready", readinessCheck);
app.get("/health/live", livenessCheck);

// API routes
app.use("/api", routes);

// 404 handler
app.use((req, res) => {
  logger.warn("Route not found", { method: req.method, path: req.path });
  res.status(404).json({ error: "Not found" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const server = app.listen(PORT, async () => {
  logger.info("🚀 Server starting...", {
    port: PORT,
    environment: process.env.NODE_ENV || "development",
    nodeVersion: process.version,
  });

  if (!isProduction) {
    logger.info(`🔗 API: http://localhost:${PORT}/api`);
    logger.info(`🏥 Health: http://localhost:${PORT}/health`);
  }

  try {
    // Connect to RabbitMQ
    logger.info("Connecting to RabbitMQ...");
    await rabbitMQService.connect();
    logger.info("✅ RabbitMQ connected");

    // Initialize all queues and exchanges
    logger.info("Initializing queues...");
    await RabbitMQQueueService.initializeQueues();
    logger.info("✅ Queues initialized");

    // Start RabbitMQ consumers
    logger.info("Starting consumers...");
    await rabbitmqConsumerService.startExcelUploadConsumer();
    await rabbitmqConsumerService.startWhatsAppConsumer();
    logger.info("✅ Consumers started");

    // Start monitoring in production
    if (isProduction) {
      performanceMonitor.start();
      memoryMonitor.start();
      logger.info("✅ Monitoring started");
    }

    logger.info("🎉 Server is ready to accept connections");
  } catch (error) {
    logger.error("Failed to initialize services", error as Error);
    logger.warn("Server is running but some services may not be available");
  }
});

// Setup graceful shutdown
gracefulShutdown.setServer(server);
gracefulShutdown.setupHandlers();
