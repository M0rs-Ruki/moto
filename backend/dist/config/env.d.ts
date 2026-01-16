/**
 * Environment variable validation and configuration
 */
interface EnvConfig {
    DATABASE_URL: string;
    JWT_SECRET: string;
    WHATSAPP_API_URL: string;
    WHATSAPP_API_TOKEN: string;
    WHATSAPP_API_ACCESS_KEY: string;
    PORT: number;
    NODE_ENV: "development" | "production" | "test";
    CORS_ORIGIN: string;
    CRON_SECRET?: string;
    BLOB_READ_WRITE_TOKEN?: string;
}
export declare const env: EnvConfig;
export {};
//# sourceMappingURL=env.d.ts.map