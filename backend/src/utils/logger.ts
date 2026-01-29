/**
 * Production-ready logging utility
 * Provides structured logging with different levels
 */

enum LogLevel {
  ERROR = "ERROR",
  WARN = "WARN",
  INFO = "INFO",
  DEBUG = "DEBUG",
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === "production";
  }

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry;

    if (this.isProduction) {
      // JSON format for production (easier to parse by log aggregators)
      return JSON.stringify({
        level,
        message,
        timestamp,
        ...(context && { context }),
        ...(error && {
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
        }),
      });
    } else {
      // Human-readable format for development
      const contextStr = context ? ` ${JSON.stringify(context)}` : "";
      const errorStr = error ? `\n${error.stack}` : "";
      return `[${timestamp}] ${level}: ${message}${contextStr}${errorStr}`;
    }
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error,
  ): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    const formatted = this.formatLog(entry);

    // Write to appropriate stream
    if (level === LogLevel.ERROR) {
      console.error(formatted);
    } else if (level === LogLevel.WARN) {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  debug(message: string, context?: Record<string, any>): void {
    if (!this.isProduction) {
      this.log(LogLevel.DEBUG, message, context);
    }
  }

  // HTTP request logging
  httpRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    userId?: string,
  ): void {
    this.info("HTTP Request", {
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
      userId,
    });
  }

  // Database operation logging
  dbOperation(
    operation: string,
    table: string,
    duration: number,
    error?: Error,
  ): void {
    if (error) {
      this.error(`Database ${operation} failed`, error, {
        table,
        duration: `${duration}ms`,
      });
    } else {
      this.debug(`Database ${operation}`, { table, duration: `${duration}ms` });
    }
  }

  // Service operation logging
  serviceOperation(
    service: string,
    operation: string,
    success: boolean,
    duration?: number,
    context?: Record<string, any>,
  ): void {
    const level = success ? LogLevel.INFO : LogLevel.ERROR;
    const message = `${service}.${operation} ${success ? "succeeded" : "failed"}`;
    this.log(level, message, {
      ...context,
      ...(duration && { duration: `${duration}ms` }),
    });
  }
}

export const logger = new Logger();
