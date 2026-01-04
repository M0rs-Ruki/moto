import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
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

// Test connection on startup (only in production)
if (process.env.NODE_ENV === "production") {
  prisma.$connect().catch((error) => {
    console.error("Failed to connect to database:", error);
    console.error(
      "Please check your DATABASE_URL environment variable and ensure the database server is accessible."
    );
  });
}

export default prisma;
