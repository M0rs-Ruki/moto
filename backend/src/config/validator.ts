/**
 * Production configuration validator
 * Validates all required environment variables and settings
 */

import { logger } from "../utils/logger";

interface ConfigCheck {
  name: string;
  check: () => boolean;
  severity: "error" | "warning";
  message: string;
}

export class ConfigValidator {
  private checks: ConfigCheck[] = [];

  constructor() {
    this.setupChecks();
  }

  private setupChecks(): void {
    // Critical checks (will prevent startup)
    this.checks.push({
      name: "DATABASE_URL",
      check: () =>
        !!process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0,
      severity: "error",
      message: "DATABASE_URL is required",
    });

    this.checks.push({
      name: "JWT_SECRET",
      check: () => {
        const secret = process.env.JWT_SECRET;
        return !!secret && secret.length >= 32;
      },
      severity: "error",
      message: "JWT_SECRET must be at least 32 characters long",
    });

    // Production-specific critical checks
    if (process.env.NODE_ENV === "production") {
      this.checks.push({
        name: "PRODUCTION_JWT_SECRET",
        check: () => {
          const secret = process.env.JWT_SECRET;
          return (
            secret !== "change-me-to-a-strong-shared-secret" &&
            secret !== "your-secret-key"
          );
        },
        severity: "error",
        message: "JWT_SECRET must be changed from default value in production",
      });

      this.checks.push({
        name: "PRODUCTION_CORS_ORIGIN",
        check: () => {
          const origin = process.env.CORS_ORIGIN;
          return !!origin && !origin.includes("localhost");
        },
        severity: "error",
        message: "CORS_ORIGIN must not be localhost in production",
      });

      this.checks.push({
        name: "CRON_SECRET",
        check: () => {
          const secret = process.env.CRON_SECRET;
          return !!secret && secret.length >= 20;
        },
        severity: "error",
        message:
          "CRON_SECRET must be set and at least 20 characters in production",
      });
    }

    // Warning checks (won't prevent startup but should be addressed)
    this.checks.push({
      name: "WHATSAPP_API_TOKEN",
      check: () => !!process.env.WHATSAPP_API_TOKEN,
      severity: "warning",
      message: "WHATSAPP_API_TOKEN is not set - WhatsApp features may not work",
    });

    this.checks.push({
      name: "RABBITMQ_URL",
      check: () => !!process.env.RABBITMQ_URL,
      severity: "warning",
      message: "RABBITMQ_URL is not set - using default connection",
    });

    this.checks.push({
      name: "NODE_ENV",
      check: () => {
        const env = process.env.NODE_ENV;
        return env === "production" || env === "development" || env === "test";
      },
      severity: "warning",
      message: "NODE_ENV should be set to production, development, or test",
    });
  }

  validate(): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const check of this.checks) {
      try {
        const passed = check.check();

        if (!passed) {
          if (check.severity === "error") {
            errors.push(`[${check.name}] ${check.message}`);
          } else {
            warnings.push(`[${check.name}] ${check.message}`);
          }
        }
      } catch (error) {
        errors.push(
          `[${check.name}] Check failed: ${(error as Error).message}`,
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  validateAndLog(): boolean {
    logger.info("Validating configuration...");

    const result = this.validate();

    // Log warnings
    if (result.warnings.length > 0) {
      result.warnings.forEach((warning) => {
        logger.warn(warning);
      });
    }

    // Log errors
    if (result.errors.length > 0) {
      result.errors.forEach((error) => {
        logger.error(error);
      });
    }

    if (result.valid && result.warnings.length === 0) {
      logger.info("✅ Configuration validation passed");
    } else if (result.valid) {
      logger.info("⚠️  Configuration validation passed with warnings");
    } else {
      logger.error("❌ Configuration validation failed");
    }

    return result.valid;
  }
}

export const configValidator = new ConfigValidator();
