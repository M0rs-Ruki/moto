import { rabbitMQService } from "./rabbitmq.service";
import { RabbitMQQueueService } from "./rabbitmq-queue.service";
import { DigitalEnquiryService } from "./digital-enquiry.service";
import { FieldInquiryService } from "./field-inquiry.service";
import { bulkUploadJobRepository } from "../repositories/bulk-upload-job.repository";
import { ExcelUploadJobData } from "./rabbitmq-publisher.service";

export class RabbitMQConsumerService {
  private digitalEnquiryService: DigitalEnquiryService;
  private fieldInquiryService: FieldInquiryService;

  constructor() {
    this.digitalEnquiryService = new DigitalEnquiryService();
    this.fieldInquiryService = new FieldInquiryService();
  }

  /**
   * Start consuming messages from Excel upload queue
   */
  async startExcelUploadConsumer(): Promise<void> {
    try {
      const channel = rabbitMQService.getChannel();
      if (!channel) {
        throw new Error("RabbitMQ channel is not initialized");
      }

      // Set prefetch to 1 (process one message at a time)
      await channel.prefetch(1);

      // Start consuming from the excel-upload-queue
      await channel.consume(
        RabbitMQQueueService.EXCEL_UPLOAD_QUEUE,
        async (msg) => {
          if (!msg) return;

          try {
            const jobData: ExcelUploadJobData = JSON.parse(
              msg.content.toString(),
            );

            console.log(`📥 Processing Excel upload job: ${jobData.jobId}`);

            // Process the job
            await this.processExcelUpload(jobData);

            // Acknowledge the message (remove from queue)
            channel.ack(msg);

            console.log(`✅ Completed Excel upload job: ${jobData.jobId}`);
          } catch (error) {
            console.error(`❌ Error processing message:`, error);

            // Nack the message and requeue it (put it back in the queue)
            channel.nack(msg, false, true);
          }
        },
      );

      console.log("🔄 Excel upload consumer started");
    } catch (error) {
      console.error("❌ Error starting Excel upload consumer:", error);
      setTimeout(() => this.startExcelUploadConsumer(), 5000);
    }
  }

  /**
   * Start consuming messages from WhatsApp queue
   */
  async startWhatsAppConsumer(): Promise<void> {
    try {
      const channel = rabbitMQService.getChannel();
      if (!channel) {
        throw new Error("RabbitMQ channel is not initialized");
      }

      await channel.prefetch(5); // Process 5 WhatsApp messages in parallel

      await channel.consume(
        RabbitMQQueueService.WHATSAPP_QUEUE,
        async (msg) => {
          if (!msg) return;

          try {
            const messageData = JSON.parse(msg.content.toString());

            console.log(
              `📱 Sending WhatsApp message to: ${messageData.phoneNumber}`,
            );

            // Send WhatsApp message (implement based on your whatsapp service)
            // await this.whatsappClient.sendTemplateMessage(messageData);

            channel.ack(msg);

            console.log(
              `✅ WhatsApp message sent to: ${messageData.phoneNumber}`,
            );
          } catch (error) {
            console.error(`❌ Error sending WhatsApp message:`, error);
            channel.nack(msg, false, true);
          }
        },
      );

      console.log("🔄 WhatsApp message consumer started");
    } catch (error) {
      console.error("❌ Error starting WhatsApp consumer:", error);
      setTimeout(() => this.startWhatsAppConsumer(), 5000);
    }
  }

  /**
   * Process Excel upload job
   */
  private async processExcelUpload(jobData: ExcelUploadJobData): Promise<void> {
    try {
      // Mark job as processing
      await bulkUploadJobRepository.updateJobProgress(jobData.jobId, {
        status: "PROCESSING",
      });

      let successCount = 0;
      let errorCount = 0;
      const failedRows = [];

      // Process rows based on type
      for (let i = 0; i < jobData.rows.length; i++) {
        const row = jobData.rows[i];
        const rowNumber = i + 2; // Excel row numbers start at 2 (1 = header)

        try {
          if (jobData.type === "digital_enquiry") {
            // Parse Excel row - handle both Excel column names and pre-parsed data
            const nameParts = String(row.Name || row.firstName || "")
              .trim()
              .split(/\s+/);
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";
            const whatsappNumber = String(
              row["WhatsApp Number"] || row.whatsappNumber || "",
            ).trim();
            const location = String(row.Location || row.address || "").trim();
            const model = String(row.Model || row.reason || "").trim();
            const source = String(row.Source || "").trim();

            // Skip rows with missing required data
            if (!firstName || !whatsappNumber) {
              errorCount++;
              failedRows.push({
                rowNumber,
                error: "Missing required data (Name or WhatsApp Number)",
                data: row,
              });

              await bulkUploadJobRepository.createJobResult({
                jobId: jobData.jobId,
                rowNumber,
                success: false,
                error: "Missing required data (Name or WhatsApp Number)",
              });
              continue;
            }

            // Process digital enquiry row
            await this.digitalEnquiryService.createEnquiry(
              {
                firstName,
                lastName,
                whatsappNumber,
                email: row.email || undefined,
                address: location || undefined,
                reason: model || "",
                leadScope: row.leadScope || "WARM",
              },
              jobData.dealershipId,
            );

            successCount++;
          } else if (jobData.type === "field_inquiry") {
            // Process field inquiry row
            await this.fieldInquiryService.createInquiry(
              {
                firstName: row.firstName || "",
                lastName: row.lastName || "",
                whatsappNumber: row.whatsappNumber || "",
                email: row.email || undefined,
                address: row.address || undefined,
                reason: row.reason || "",
              },
              jobData.dealershipId,
            );

            successCount++;
          }

          // Store successful result
          await bulkUploadJobRepository.createJobResult({
            jobId: jobData.jobId,
            rowNumber,
            success: true,
          });
        } catch (rowError) {
          errorCount++;
          failedRows.push({
            rowNumber,
            error: (rowError as Error).message,
            data: row,
          });

          // Store failed result
          await bulkUploadJobRepository.createJobResult({
            jobId: jobData.jobId,
            rowNumber,
            success: false,
            error: (rowError as Error).message,
          });
        }

        // Update progress after every 10 rows
        if ((i + 1) % 10 === 0) {
          await bulkUploadJobRepository.updateJobProgress(jobData.jobId, {
            processedRows: i + 1,
            successCount,
            errorCount,
          });
        }
      }

      // Mark job as completed
      await bulkUploadJobRepository.completeJob(jobData.jobId, {
        successCount,
        errorCount,
        failedRows: failedRows.length > 0 ? failedRows : undefined,
      });

      console.log(
        `📊 Job ${jobData.jobId} completed: ${successCount} success, ${errorCount} errors`,
      );
    } catch (error) {
      console.error(`❌ Error processing Excel upload job:`, error);

      // Mark job as failed
      await bulkUploadJobRepository.failJob(
        jobData.jobId,
        (error as Error).message,
      );

      throw error;
    }
  }
}

export const rabbitmqConsumerService = new RabbitMQConsumerService();
