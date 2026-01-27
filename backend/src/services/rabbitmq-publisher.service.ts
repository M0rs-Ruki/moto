import { rabbitMQService } from "./rabbitmq.service";
import { RabbitMQQueueService } from "./rabbitmq-queue.service";

export interface ExcelUploadJobData {
  jobId: string;
  dealershipId: string;
  type: "digital_enquiry" | "field_inquiry";
  rows: Record<string, any>[]; // Excel rows data
  totalRows: number;
  userId: string;
  timestamp: number;
}

export interface WhatsAppMessageData {
  messageId: string;
  phoneNumber: string;
  templateName: string;
  parameters: Record<string, string>;
  dealershipId: string;
  timestamp: number;
}

export class RabbitMQPublisherService {
  /**
   * Publish Excel upload job to queue
   */
  static async publishExcelUploadJob(
    jobData: ExcelUploadJobData,
  ): Promise<void> {
    try {
      const channel = rabbitMQService.getChannel();
      if (!channel) {
        throw new Error("RabbitMQ channel is not initialized");
      }

      // Convert job data to JSON
      const message = JSON.stringify(jobData);

      // Publish message to exchange with routing key
      const published = await channel.publish(
        RabbitMQQueueService.EXCEL_UPLOAD_EXCHANGE,
        "excel.upload", // routing key
        Buffer.from(message),
        {
          persistent: true, // Message survives RabbitMQ restart
          contentType: "application/json",
          timestamp: Date.now(),
        },
      );

      if (!published) {
        throw new Error("Failed to publish message - queue is full");
      }

      console.log(`✅ Excel upload job published: ${jobData.jobId}`);
    } catch (error) {
      console.error("❌ Error publishing Excel upload job:", error);
      throw error;
    }
  }

  /**
   * Publish WhatsApp message to queue
   */
  static async publishWhatsAppMessage(
    messageData: WhatsAppMessageData,
  ): Promise<void> {
    try {
      const channel = rabbitMQService.getChannel();
      if (!channel) {
        throw new Error("RabbitMQ channel is not initialized");
      }

      const message = JSON.stringify(messageData);

      const published = await channel.publish(
        RabbitMQQueueService.WHATSAPP_EXCHANGE,
        "whatsapp.message", // routing key
        Buffer.from(message),
        {
          persistent: true,
          contentType: "application/json",
          timestamp: Date.now(),
        },
      );

      if (!published) {
        throw new Error("Failed to publish message - queue is full");
      }

      console.log(`✅ WhatsApp message published: ${messageData.messageId}`);
    } catch (error) {
      console.error("❌ Error publishing WhatsApp message:", error);
      throw error;
    }
  }
}
