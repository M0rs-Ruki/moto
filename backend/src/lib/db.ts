import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

// Check if DATABASE_URL is set
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  logger.error("DATABASE_URL environment variable is not set!");
  logger.error("Please set DATABASE_URL in your environment variables.");
  // Don't throw immediately - let it fail when actually used
  // This allows the app to start and show better error messages
}

// Store DATABASE_URL with type assertion
const DB_URL = DATABASE_URL as string;

const prismaClientSingleton = () => {
  if (!DATABASE_URL) {
    throw new Error(
      "DATABASE_URL environment variable is not set. Please configure it in your environment variables.",
    );
  }

  // Log connection info (without sensitive data)
  if (process.env.NODE_ENV === "production") {
    try {
      const urlObj = new URL(DB_URL);
      logger.info(
        `Connecting to database: ${urlObj.hostname}:${urlObj.port || 5432}`,
      );
    } catch (error) {
      logger.warn("Could not parse DATABASE_URL for logging");
    }
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: DB_URL,
      },
    },
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Handle connection errors gracefully
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

// Test connection on startup (only in production and if DATABASE_URL is set)
if (process.env.NODE_ENV === "production" && DATABASE_URL) {
  prisma
    .$connect()
    .then(() => {
      logger.info("✅ Database connected successfully");
    })
    .catch((error) => {
      logger.error("Failed to connect to database", error);
      logger.error(
        `DATABASE_URL format: ${DATABASE_URL.replace(/:[^:@]+@/, ":****@")}`,
      );
      logger.error(
        "Please check your DATABASE_URL environment variable and ensure the database server is accessible.",
      );
    });
}

export default prisma;
