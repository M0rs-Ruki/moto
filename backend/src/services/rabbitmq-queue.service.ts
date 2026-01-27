import * as amqp from "amqplib";
import { rabbitMQService } from "./rabbitmq.service";

export class RabbitMQQueueService {
  static readonly EXCEL_UPLOAD_QUEUE = "excel-upload-queue";
  static readonly EXCEL_UPLOAD_EXCHANGE = "excel-upload-exchange";
  static readonly WHATSAPP_QUEUE = "whatsapp-messages-queue";
  static readonly WHATSAPP_EXCHANGE = "whatsapp-exchange";

  static async initializeQueues(): Promise<void> {
    try {
      const channel = rabbitMQService.getChannel();
      if (!channel) {
        throw new Error("RabbitMQ channel is not initialized");
      }
      console.log("Initializing RabbitMQ queues and exchanges...");

      await channel.assertExchange(this.EXCEL_UPLOAD_EXCHANGE, "direct", {
        durable: true,
      });

      console.log(`Exchange '${this.EXCEL_UPLOAD_EXCHANGE}' asserted.`);

      await channel.assertQueue(this.EXCEL_UPLOAD_QUEUE, {
        durable: true,
        maxLength: 1000,
      });

      console.log(`Queue '${this.EXCEL_UPLOAD_QUEUE}' asserted.`);

      await channel.bindQueue(
        this.EXCEL_UPLOAD_QUEUE,
        this.EXCEL_UPLOAD_EXCHANGE,
        "excel.upload",
      );

      console.log(
        `Queue '${this.EXCEL_UPLOAD_QUEUE}' bound to exchange '${this.EXCEL_UPLOAD_EXCHANGE}' with routing key 'excel.upload'.`,
      );

      await channel.assertExchange(this.WHATSAPP_EXCHANGE, "direct", {
        durable: true,
      });
      console.log(`Exchange '${this.WHATSAPP_EXCHANGE}' asserted.`);

      await channel.assertQueue(this.WHATSAPP_QUEUE, {
        durable: true,
        maxLength: 1000,
      });

      console.log(`Queue '${this.WHATSAPP_QUEUE}' asserted.`);

      await channel.bindQueue(
        this.WHATSAPP_QUEUE,
        this.WHATSAPP_EXCHANGE,
        "whatsapp.message",
      );

      console.log(
        `Queue '${this.WHATSAPP_QUEUE}' bound to exchange '${this.WHATSAPP_EXCHANGE}' with routing key 'whatsapp.message'.`,
      );

      console.log("RabbitMQ queues and exchanges initialized successfully.");
    } catch (error) {
      console.error("Error initializing RabbitMQ queues and exchanges:", error);
      throw error;
    }
  }
}

export const rabbitmqQueueService = new RabbitMQQueueService();
