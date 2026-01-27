import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";
import { rabbitMQService } from "./services/rabbitmq.service";
import { RabbitMQQueueService } from "./services/rabbitmq-queue.service";
import { rabbitmqConsumerService } from "./services/rabbitmq-consumer.service";

const app: Express = express();
const PORT = process.env.PORT || 8000;

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development only)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  if (process.env.NODE_ENV === "development") {
    console.log(`🔗 API: http://localhost:${PORT}/api`);
  }

  // Connect to RabbitMQ (all environments)
  await rabbitMQService.connect().catch((err) => {
    console.error("Failed to connect to RabbitMQ on startup:", err);
  });

  // Initialize all queues and exchanges
  await RabbitMQQueueService.initializeQueues().catch((err) => {
    console.error("Failed to initialize queues:", err);
  });

  // Start RabbitMQ consumers
  await rabbitmqConsumerService.startExcelUploadConsumer().catch((err) => {
    console.error("Failed to start Excel upload consumer:", err);
  });

  await rabbitmqConsumerService.startWhatsAppConsumer().catch((err) => {
    console.error("Failed to start WhatsApp consumer:", err);
  });
});

process.on("SIGINT", async () => {
  console.log("Received SIGINT. Shutting down gracefully...");
  await rabbitMQService.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Shutting down gracefully...");
  await rabbitMQService.disconnect();
  process.exit(0);
});
