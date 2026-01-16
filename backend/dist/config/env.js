/**
 * Environment variable validation and configuration
 */
function getEnvVar(key, defaultValue) {
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}
function getEnvNumber(key, defaultValue) {
    const value = process.env[key];
    if (!value) {
        return defaultValue;
    }
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
        throw new Error(`Invalid number for environment variable: ${key}`);
    }
    return parsed;
}
export const env = {
    DATABASE_URL: getEnvVar("DATABASE_URL"),
    JWT_SECRET: getEnvVar("JWT_SECRET"),
    WHATSAPP_API_URL: getEnvVar("WHATSAPP_API_URL", "https://api.chati.ai/v1/public/api"),
    WHATSAPP_API_TOKEN: getEnvVar("WHATSAPP_API_TOKEN"),
    WHATSAPP_API_ACCESS_KEY: getEnvVar("WHATSAPP_API_ACCESS_KEY"),
    PORT: getEnvNumber("PORT", 8000),
    NODE_ENV: process.env.NODE_ENV || "development",
    CORS_ORIGIN: getEnvVar("CORS_ORIGIN", "http://localhost:3000"),
    CRON_SECRET: process.env.CRON_SECRET,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
};
//# sourceMappingURL=env.js.map