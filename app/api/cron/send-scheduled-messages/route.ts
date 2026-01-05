import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { whatsappClient } from "@/lib/whatsapp";

// Batch size for processing messages
const BATCH_SIZE = 100;

export async function GET(request: NextRequest) {
  try {
    // Vercel cron authentication
    const authHeader = request.headers.get("authorization");
    const vercelCronHeader = request.headers.get("x-vercel-cron");
    const cronSecret = process.env.CRON_SECRET;

    // Check if this is a Vercel cron request
    const isVercelCron = vercelCronHeader === "1";
    
    // If not a Vercel cron, check for manual authorization
    if (!isVercelCron) {
      if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const now = new Date();

    // Find all pending messages that should be sent now
    const pendingMessages = await prisma.scheduledMessage.findMany({
      where: {
        status: "pending",
        scheduledFor: {
          lte: now,
        },
      },
      include: {
        deliveryTicket: {
          include: {
            model: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      take: BATCH_SIZE,
      orderBy: {
        scheduledFor: "asc",
      },
    });

    if (pendingMessages.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        message: "No pending messages to process",
      });
    }

    let sentCount = 0;
    let failedCount = 0;

    // Process messages in parallel (but limit concurrency)
    const results = await Promise.allSettled(
      pendingMessages.map(async (scheduledMessage) => {
        const ticket = scheduledMessage.deliveryTicket;

        if (!ticket.whatsappContactId) {
          // Mark as failed if no contact ID
          await prisma.scheduledMessage.update({
            where: { id: scheduledMessage.id },
            data: {
              status: "failed",
              retryCount: scheduledMessage.retryCount + 1,
            },
          });
          return { success: false, reason: "No WhatsApp contact ID" };
        }

        // Get delivery template (check section-specific first, then global)
        const template = await prisma.whatsAppTemplate.findFirst({
          where: {
            dealershipId: ticket.dealershipId,
            type: "delivery_reminder",
            OR: [
              { section: "delivery_update" },
              { section: "global" },
              { section: null },
            ],
          },
          orderBy: [
            { section: "asc" }, // Prefer section-specific over global
          ],
        });

        if (!template) {
          await prisma.scheduledMessage.update({
            where: { id: scheduledMessage.id },
            data: {
              status: "failed",
              retryCount: scheduledMessage.retryCount + 1,
            },
          });
          return { success: false, reason: "Template not found" };
        }

        if (!template.templateId || !template.templateName) {
          await prisma.scheduledMessage.update({
            where: { id: scheduledMessage.id },
            data: {
              status: "failed",
              retryCount: scheduledMessage.retryCount + 1,
            },
          });
          return {
            success: false,
            reason:
              "Template not fully configured (missing Template ID or Template Name)",
          };
        }

        try {
          const modelName = ticket.model
            ? `${ticket.model.category.name} - ${ticket.model.name}`
            : "N/A";
          
          // Calculate days before delivery
          const deliveryDate = new Date(ticket.deliveryDate);
          const scheduledDate = new Date(scheduledMessage.scheduledFor);
          
          // Normalize dates to compare only the date portion
          deliveryDate.setHours(0, 0, 0, 0);
          scheduledDate.setHours(0, 0, 0, 0);
          
          const diffTime = deliveryDate.getTime() - scheduledDate.getTime();
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
          const daysBeforeStr = String(diffDays);

          await whatsappClient.sendTemplate({
            contactId: ticket.whatsappContactId,
            contactNumber: ticket.whatsappNumber,
            templateName: template.templateName,
            templateId: template.templateId,
            templateLanguage: template.language,
            parameters: [modelName, daysBeforeStr],
          });

          // Mark as sent
          await prisma.scheduledMessage.update({
            where: { id: scheduledMessage.id },
            data: {
              status: "sent",
              sentAt: new Date(),
            },
          });

          // Update ticket
          await prisma.deliveryTicket.update({
            where: { id: ticket.id },
            data: { messageSent: true },
          });

          return { success: true };
        } catch (error: unknown) {
          const retryCount = scheduledMessage.retryCount + 1;
          const maxRetries = 3;

          if (retryCount >= maxRetries) {
            // Mark as failed after max retries
            await prisma.scheduledMessage.update({
              where: { id: scheduledMessage.id },
              data: {
                status: "failed",
                retryCount,
              },
            });
            return {
              success: false,
              reason: (error as Error).message || "Failed to send",
            };
          } else {
            // Keep as pending for retry
            await prisma.scheduledMessage.update({
              where: { id: scheduledMessage.id },
              data: {
                retryCount,
              },
            });
            return {
              success: false,
              reason: (error as Error).message || "Failed to send",
              willRetry: true,
            };
          }
        }
      })
    );

    // Count results
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        if (result.value.success) {
          sentCount++;
        } else {
          failedCount++;
        }
      } else {
        failedCount++;
      }
    });

    return NextResponse.json({
      success: true,
      processed: pendingMessages.length,
      sent: sentCount,
      failed: failedCount,
    });
  } catch (error: unknown) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
