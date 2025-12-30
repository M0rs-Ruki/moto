import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const templates = await prisma.whatsAppTemplate.findMany({
      where: {
        dealershipId: user.dealershipId,
      },
      orderBy: {
        type: "asc",
      },
    });

    // Ensure delivery_reminder template exists (for existing users)
    const hasDeliveryReminder = templates.some(
      (t) => t.type === "delivery_reminder"
    );

    if (!hasDeliveryReminder) {
      // Create placeholder delivery reminder template
      const deliveryTemplate = await prisma.whatsAppTemplate.create({
        data: {
          name: "Delivery Reminder",
          templateId: "",
          templateName: "",
          language: "en_US",
          type: "delivery_reminder",
          section: "delivery_update",
          dealershipId: user.dealershipId,
        },
      });
      templates.push(deliveryTemplate);
    }

    // Ensure digital_enquiry template exists (for existing users)
    const hasDigitalEnquiry = templates.some(
      (t) => t.type === "digital_enquiry" && t.section === "digital_enquiry"
    );

    if (!hasDigitalEnquiry) {
      // Create placeholder digital enquiry template
      const digitalEnquiryTemplate = await prisma.whatsAppTemplate.create({
        data: {
          name: "Digital Enquiry",
          templateId: "",
          templateName: "",
          language: "en_US",
          type: "digital_enquiry",
          section: "digital_enquiry",
          dealershipId: user.dealershipId,
        },
      });
      templates.push(digitalEnquiryTemplate);
    }

    // Ensure delivery_completion template exists (for existing users)
    const hasDeliveryCompletion = templates.some(
      (t) => t.type === "delivery_completion" && t.section === "delivery_update"
    );

    if (!hasDeliveryCompletion) {
      // Create placeholder delivery completion template
      const deliveryCompletionTemplate = await prisma.whatsAppTemplate.create({
        data: {
          name: "Delivery Completion",
          templateId: "",
          templateName: "",
          language: "en_US",
          type: "delivery_completion",
          section: "delivery_update",
          dealershipId: user.dealershipId,
        },
      });
      templates.push(deliveryCompletionTemplate);
    }

    // Ensure field_inquiry template exists (for existing users)
    const hasFieldInquiry = templates.some(
      (t) => t.type === "field_inquiry" && t.section === "field_inquiry"
    );

    if (!hasFieldInquiry) {
      // Create placeholder field inquiry template
      const fieldInquiryTemplate = await prisma.whatsAppTemplate.create({
        data: {
          name: "Field Inquiry",
          templateId: "",
          templateName: "",
          language: "en_US",
          type: "field_inquiry",
          section: "field_inquiry",
          dealershipId: user.dealershipId,
        },
      });
      templates.push(fieldInquiryTemplate);
    }

    return NextResponse.json({ templates });
  } catch (error: unknown) {
    console.error("Get templates error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, templateId, templateName, language, section } = body;

    if (!id || !name || !templateId || !templateName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify template belongs to user's dealership
    const existingTemplate = await prisma.whatsAppTemplate.findFirst({
      where: {
        id,
        dealershipId: user.dealershipId,
      },
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    const template = await prisma.whatsAppTemplate.update({
      where: { id },
      data: {
        name,
        templateId,
        templateName,
        language: language || "en_US",
        section: section || existingTemplate.section || "global",
      },
    });

    return NextResponse.json({ success: true, template });
  } catch (error: unknown) {
    console.error("Update template error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
