import * as amqp from "amqplib";
import { logger } from "../utils/logger";
import { RabbitMQQueueService } from "./rabbitmq-queue.service";

class RabbitMQService {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private onConnectCallback: (() => Promise<void>) | null = null;

  setOnConnect(callback: () => Promise<void>): void {
    this.onConnectCallback = callback;
  }

  async connect(): Promise<void> {
    try {
      const rabbitmqUrl =
        process.env.RABBITMQ_URL || "amqp://admin:admin123@localhost:5672";
      this.connection = (await amqp.connect(rabbitmqUrl)) as any;
      this.channel = await (this.connection as any).createChannel();

      logger.info("✅ Connected to RabbitMQ");

      // Assert exchanges and queues on this channel (required after reconnect or when exchange was missing)
      await RabbitMQQueueService.initializeQueues();

      if (this.onConnectCallback) {
        await this.onConnectCallback();
      }

      (this.connection as any).on("error", (err: any) => {
        logger.error("RabbitMQ connection error", err);
        this.reconnect();
      });

      (this.connection as any).on("close", () => {
        logger.warn("RabbitMQ connection closed. Reconnecting...");
        this.reconnect();
      });
    } catch (error) {
      logger.error("Failed to connect to RabbitMQ", error as Error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  private reconnect(): void {
    this.connection = null;
    this.channel = null;
    logger.info("Attempting to reconnect to RabbitMQ...");
    setTimeout(() => this.connect(), 5000);
  }

  getChannel(): amqp.Channel | null {
    if (!this.channel) {
      throw new Error(
        "RabbitMQ channel is not established. Call connect() first.",
      );
    }
    return this.channel;
  }

  getConnection(): amqp.Connection {
    if (!this.connection) {
      throw new Error(
        "RabbitMQ connection is not established. Call connect() first.",
      );
    }
    return this.connection;
  }

  isConnected(): boolean {
    return this.connection !== null && this.channel !== null;
  }

  async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await (this.connection as any).close();
      }
      logger.info("Disconnected from RabbitMQ");
    } catch (error) {
      logger.error("Error while disconnecting from RabbitMQ", error as Error);
    }
  }
}

export const rabbitMQService = new RabbitMQService();
