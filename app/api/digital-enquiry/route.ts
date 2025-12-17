import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { whatsappClient } from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      whatsappNumber,
      email,
      address,
      reason,
      leadSourceId,
      leadScope,
      interestedModelId,
    } = body;

    // Validation
    if (!firstName || !lastName || !whatsappNumber || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if contact already exists
    const existingEnquiry = await prisma.digitalEnquiry.findFirst({
      where: {
        dealershipId: user.dealershipId,
        whatsappNumber: whatsappNumber,
      },
    });

    let whatsappContactId = existingEnquiry?.whatsappContactId || "";

    // Create WhatsApp contact if it doesn't exist
    if (!whatsappContactId) {
      try {
        const contactResult = await whatsappClient.createContact({
          firstName,
          lastName,
          contact_number: whatsappNumber,
          email: email || "",
          address: address || "",
        });

        whatsappContactId = contactResult.contactId;

        if (!whatsappContactId) {
          throw new Error("No contact ID returned from WhatsApp API");
        }
      } catch (error: unknown) {
        console.error(
          "Failed to create WhatsApp contact:",
          (error as Error).message
        );
        return NextResponse.json(
          {
            error: "Failed to create WhatsApp contact",
            details: (error as Error).message,
          },
          { status: 500 }
        );
      }
    }

    // Create digital enquiry
    const enquiry = await prisma.digitalEnquiry.create({
      data: {
        firstName,
        lastName,
        whatsappNumber,
        email: email || null,
        address: address || null,
        reason,
        leadScope: leadScope || "medium",
        whatsappContactId,
        dealershipId: user.dealershipId,
        leadSourceId: leadSourceId || null,
        interestedModelId: interestedModelId || null,
      },
    });

    // Get WhatsApp template for digital enquiry
    const template = await prisma.whatsAppTemplate.findFirst({
      where: {
        dealershipId: user.dealershipId,
        type: "digital_enquiry",
        section: "digital_enquiry",
      },
    });

    let messageStatus = "not_sent";
    let messageError = null;

    // Send template message (always send when creating enquiry, template only, no parameters)
    if (template && template.templateId && template.templateName && whatsappContactId) {
      try {
        await whatsappClient.sendTemplate({
          contactId: whatsappContactId,
          contactNumber: whatsappNumber,
          templateName: template.templateName,
          templateId: template.templateId,
          templateLanguage: template.language,
          parameters: [], // No parameters - just send the template
        });
        messageStatus = "sent";
      } catch (error: unknown) {
        console.error("Failed to send digital enquiry message:", error);
        messageStatus = "failed";
        messageError =
          (error as Error).message || "Failed to send digital enquiry message";
      }
    } else if (template && (!template.templateId || !template.templateName)) {
      messageStatus = "not_configured";
      messageError = "Template ID or Template Name not configured";
    }

    return NextResponse.json({
      success: true,
      enquiry: {
        id: enquiry.id,
        firstName: enquiry.firstName,
        lastName: enquiry.lastName,
      },
      message: {
        status: messageStatus,
        error: messageError,
      },
    });
  } catch (error: unknown) {
    console.error("Create digital enquiry error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const enquiries = await prisma.digitalEnquiry.findMany({
      where: {
        dealershipId: user.dealershipId,
      },
      include: {
        leadSource: true,
        model: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ enquiries });
  } catch (error: unknown) {
    console.error("Get digital enquiries error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

