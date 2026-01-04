import { PrismaClient } from "@prisma/client";

// Validate DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set!");
  throw new Error("DATABASE_URL environment variable is required");
}

const prismaClientSingleton = () => {
  const databaseUrl = process.env.DATABASE_URL;
  
  // Log connection info (without sensitive data)
  if (process.env.NODE_ENV === "production") {
    const urlObj = new URL(databaseUrl);
    console.log(`🔌 Connecting to database: ${urlObj.hostname}:${urlObj.port || 5432}`);
  }
  
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    datasources: {
      db: {
        url: databaseUrl,
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
  prisma.$connect()
    .then(() => {
      console.log("✅ Database connected successfully");
    })
    .catch((error) => {
      console.error("❌ Failed to connect to database:", error.message);
      console.error("DATABASE_URL format:", process.env.DATABASE_URL?.replace(/:[^:@]+@/, ":****@"));
      console.error(
        "Please check your DATABASE_URL environment variable and ensure the database server is accessible."
      );
    });
}

export default prisma;
