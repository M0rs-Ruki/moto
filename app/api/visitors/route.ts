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
      modelIds, // Array of vehicle model IDs
    } = body;

    // Validation
    if (!firstName || !lastName || !whatsappNumber || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Step 1: Create WhatsApp contact
    let whatsappContactId = "";
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
    } catch (error: any) {
      console.error("Failed to create WhatsApp contact:", error.message);
      return NextResponse.json(
        { error: "Failed to create WhatsApp contact", details: error.message },
        { status: 500 }
      );
    }

    // Step 2: Create visitor in database
    const visitor = await prisma.visitor.create({
      data: {
        firstName,
        lastName,
        whatsappNumber,
        email: email || null,
        address: address || null,
        whatsappContactId,
        dealershipId: user.dealershipId,
      },
    });

    // Step 3: Create visitor session
    const session = await prisma.visitorSession.create({
      data: {
        reason,
        visitorId: visitor.id,
        status: "intake",
      },
    });

    // Step 4: Add vehicle interests linked to the session
    if (modelIds && modelIds.length > 0) {
      await prisma.visitorInterest.createMany({
        data: modelIds.map((modelId: string) => ({
          visitorId: visitor.id,
          modelId,
          sessionId: session.id, // Link interests to the first session
        })),
      });
    }

    // Step 5: Get WhatsApp template and send welcome message
    const welcomeTemplate = await prisma.whatsAppTemplate.findFirst({
      where: {
        dealershipId: user.dealershipId,
        type: "welcome",
      },
    });

    let messageStatus = "not_sent";
    let messageError = null;
    const name = `${firstName} ${lastName}`;
    const CRM = 9999999999;

    if (welcomeTemplate) {
      try {
        await whatsappClient.sendTemplate({
          contactId: whatsappContactId,
          contactNumber: whatsappNumber,
          templateName: welcomeTemplate.templateName,
          templateId: welcomeTemplate.templateId,
          templateLanguage: welcomeTemplate.language,
          parameters: [name, CRM.toString()],
        });
        messageStatus = "sent";
      } catch (error: any) {
        console.error("Failed to send welcome message:", error);
        messageStatus = "failed";
        messageError = error.message || "Failed to send welcome message";
        // Don't fail the whole operation if message sending fails
      }
    }

    return NextResponse.json({
      success: true,
      visitor: {
        id: visitor.id,
        firstName: visitor.firstName,
        lastName: visitor.lastName,
      },
      session: {
        id: session.id,
        status: session.status,
      },
      message: {
        status: messageStatus,
        error: messageError,
      },
    });
  } catch (error: any) {
    console.error("Create visitor error:", error);
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

    // Check if searching by phone number
    const searchParams = request.nextUrl.searchParams;
    const phoneNumber = searchParams.get("phone");

    if (phoneNumber) {
      // Search for visitor by phone number
      const visitor = await prisma.visitor.findFirst({
        where: {
          dealershipId: user.dealershipId,
          whatsappNumber: phoneNumber,
        },
        include: {
          sessions: {
            orderBy: { createdAt: "desc" },
          },
          interests: {
            include: {
              model: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });

      if (!visitor) {
        return NextResponse.json({ visitor: null, found: false });
      }

      return NextResponse.json({
        visitor: {
          id: visitor.id,
          firstName: visitor.firstName,
          lastName: visitor.lastName,
          whatsappNumber: visitor.whatsappNumber,
          email: visitor.email,
          address: visitor.address,
          sessionCount: visitor.sessions.length,
          interests: visitor.interests.map((i) => ({
            modelId: i.model.id,
            modelName: i.model.name,
            categoryName: i.model.category.name,
          })),
        },
        found: true,
      });
    }

    // Return all visitors
    const visitors = await prisma.visitor.findMany({
      where: {
        dealershipId: user.dealershipId,
      },
      include: {
        sessions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        interests: {
          include: {
            model: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ visitors });
  } catch (error: any) {
    console.error("Get visitors error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
