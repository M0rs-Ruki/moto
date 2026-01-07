import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { whatsappClient } from "@/lib/whatsapp";

// Normalize phone number for comparison (remove +, spaces, etc.)
function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, "");

  // If it starts with 91 and is 12 digits, remove the 91 prefix for comparison
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return cleaned.substring(2);
  }

  // Return last 10 digits (in case of any other formatting)
  return cleaned.length >= 10 ? cleaned.slice(-10) : cleaned;
}

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

    // Normalize phone number for comparison
    const normalizedPhone = normalizePhoneNumber(whatsappNumber);

    // Check if visitor with this phone number already exists (check all formats)
    // Get all visitors for this dealership and filter by normalized phone
    const allPotentialVisitors = await prisma.visitor.findMany({
      where: {
        dealershipId: user.dealershipId,
      },
      include: {
        sessions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // Find visitor with matching normalized phone number
    let visitor = allPotentialVisitors.find(
      (v) => normalizePhoneNumber(v.whatsappNumber) === normalizedPhone
    );

    let whatsappContactId = "";
    const isNewVisitor = !visitor; // Track if this is a new visitor

    if (visitor) {
      // Visitor exists - use existing contact ID or create one if missing
      whatsappContactId = visitor.whatsappContactId || "";

      // If no contact ID exists, create one
      if (!whatsappContactId) {
        try {
          const contactResult = await whatsappClient.createContact({
            firstName: visitor.firstName,
            lastName: visitor.lastName,
            contact_number: visitor.whatsappNumber,
            email: visitor.email || "",
            address: visitor.address || "",
          });

          whatsappContactId = contactResult.contactId || "";

          // If contact already exists, createContact returns success with empty contactId
          // That's okay - we can still send messages using phone number
          if (whatsappContactId) {
            // Update visitor with the new contact ID
            await prisma.visitor.update({
              where: { id: visitor.id },
              data: { whatsappContactId },
            });
          } else {
            console.log(
              "Contact exists but no contact ID available. Will use phone number for messaging."
            );
          }
        } catch (error: unknown) {
          const errorMessage = (error as Error).message;
          console.error(
            "Failed to create WhatsApp contact for existing visitor:",
            errorMessage
          );
          // Continue without contact ID - we can still send messages using phone number
          whatsappContactId = "";
        }
      }

      // Update visitor info if provided (email, address, name might have changed)
      visitor = await prisma.visitor.update({
        where: { id: visitor.id },
        data: {
          firstName: firstName, // Update name in case it changed
          lastName: lastName,
          email: email || visitor.email,
          address: address || visitor.address,
        },
        include: {
          sessions: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    } else {
      // New visitor - create WhatsApp contact
      try {
        const contactResult = await whatsappClient.createContact({
          firstName,
          lastName,
          contact_number: whatsappNumber,
          email: email || "",
          address: address || "",
        });

        whatsappContactId = contactResult.contactId || "";

        // If contact already exists, createContact returns success with empty contactId
        // That's okay - we can still send messages using phone number
        if (!whatsappContactId) {
          console.log(
            "Contact exists but no contact ID available. Will use phone number for messaging."
          );
        }
      } catch (error: unknown) {
        const errorMessage = (error as Error).message;
        console.error("Failed to create WhatsApp contact:", errorMessage);
        // Continue without contact ID - we can still send messages using phone number
        whatsappContactId = "";
      }

      // Create new visitor in database
      visitor = await prisma.visitor.create({
        data: {
          firstName,
          lastName,
          whatsappNumber,
          email: email || null,
          address: address || null,
          whatsappContactId,
          dealershipId: user.dealershipId,
        },
        include: {
          sessions: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }

    // At this point, visitor is guaranteed to exist (either found or created)
    if (!visitor) {
      return NextResponse.json(
        { error: "Failed to create or find visitor" },
        { status: 500 }
      );
    }

    // Store visitor ID for use below
    const visitorId = visitor.id;

    // Count existing sessions to determine visit number
    const sessionCount = visitor.sessions.length;
    const visitNumber = sessionCount + 1;

    // Create visitor session
    const session = await prisma.visitorSession.create({
      data: {
        reason,
        visitorId: visitorId,
        status: "intake",
      },
    });

    // Step 4: Add vehicle interests linked to the session
    if (modelIds && modelIds.length > 0) {
      await prisma.visitorInterest.createMany({
        data: modelIds.map(
          (item: string | { modelId: string; variantId?: string }) => {
            // Support both old format (string) and new format (object with variantId)
            if (typeof item === "string") {
              return {
                visitorId: visitorId,
                modelId: item,
                sessionId: session.id,
              };
            } else {
              return {
                visitorId: visitorId,
                modelId: item.modelId,
                variantId: item.variantId || null,
                sessionId: session.id,
              };
            }
          }
        ),
      });
    }

    // Step 5: Get WhatsApp template and send message
    // Always send a message when creating a session
    let messageStatus = "not_sent";
    let messageError = null;
    const name = `${firstName} ${lastName}`;

    // Send message if we have a contact ID or phone number (contactId is optional for sendTemplate)
    if (whatsappContactId || whatsappNumber) {
      if (isNewVisitor && sessionCount === 0) {
        // First visit for new visitor - send welcome message
        const welcomeTemplate = await prisma.whatsAppTemplate.findFirst({
          where: {
            dealershipId: user.dealershipId,
            type: "welcome",
          },
        });

        if (welcomeTemplate) {
          try {
            await whatsappClient.sendTemplate({
              contactId: whatsappContactId,
              contactNumber: whatsappNumber,
              templateName: welcomeTemplate.templateName,
              templateId: welcomeTemplate.templateId,
              templateLanguage: welcomeTemplate.language,
              parameters: [name],
            });
            messageStatus = "sent";
          } catch (error: unknown) {
            console.error("Failed to send welcome message:", error);
            messageStatus = "failed";
            messageError =
              (error as Error).message || "Failed to send welcome message";
            // Don't fail the whole operation if message sending fails
          }
        }
      } else {
        // Returning visitor or new session for existing visitor - send return visit message
        const returnVisitTemplate = await prisma.whatsAppTemplate.findFirst({
          where: {
            dealershipId: user.dealershipId,
            type: "return_visit",
          },
        });

        if (returnVisitTemplate) {
          try {
            const visitLabel =
              visitNumber === 1
                ? "1st"
                : visitNumber === 2
                ? "2nd"
                : visitNumber === 3
                ? "3rd"
                : `${visitNumber}th`;

            await whatsappClient.sendTemplate({
              contactId: whatsappContactId,
              contactNumber: whatsappNumber,
              templateName: returnVisitTemplate.templateName,
              templateId: returnVisitTemplate.templateId,
              templateLanguage: returnVisitTemplate.language,
              parameters: [visitor.firstName, visitLabel],
            });
            messageStatus = "sent";
          } catch (error: unknown) {
            console.error("Failed to send return visit message:", error);
            messageStatus = "failed";
            messageError =
              (error as Error).message || "Failed to send return visit message";
            // Don't fail the whole operation if message sending fails
          }
        } else {
          // Fallback to welcome template if return_visit template doesn't exist
          const welcomeTemplate = await prisma.whatsAppTemplate.findFirst({
            where: {
              dealershipId: user.dealershipId,
              type: "welcome",
            },
          });

          if (welcomeTemplate) {
            try {
              await whatsappClient.sendTemplate({
                contactId: whatsappContactId,
                contactNumber: whatsappNumber,
                templateName: welcomeTemplate.templateName,
                templateId: welcomeTemplate.templateId,
                templateLanguage: welcomeTemplate.language,
                parameters: [name],
              });
              messageStatus = "sent";
            } catch (error: unknown) {
              console.error(
                "Failed to send welcome message (fallback):",
                error
              );
              messageStatus = "failed";
              messageError =
                (error as Error).message || "Failed to send message";
            }
          }
        }
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
  } catch (error: unknown) {
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
      // Normalize phone number for search
      const normalizedPhone = normalizePhoneNumber(phoneNumber);

      // Get all visitors and find by normalized phone
      const allVisitors = await prisma.visitor.findMany({
        where: {
          dealershipId: user.dealershipId,
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

      // Find visitor with matching normalized phone number
      const visitor = allVisitors.find(
        (v) => normalizePhoneNumber(v.whatsappNumber) === normalizedPhone
      );

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

    // Get pagination parameters
    const limit = parseInt(searchParams.get("limit") || "30"); // Default 30 per page
    const skip = parseInt(searchParams.get("skip") || "0");
    const loadAll = searchParams.get("loadAll") === "true"; // Option to load all for initial grouping

    // For proper grouping by phone number, we need to fetch all visitors
    // But we can optimize by only fetching what we need if loadAll is false
    // For now, we'll fetch all to ensure proper grouping, but this can be optimized later
    const allVisitors = await prisma.visitor.findMany({
      where: {
        dealershipId: user.dealershipId,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Group by normalized phone number and keep the visitor with most sessions (or most recent if equal)
    const visitorMap = new Map<string, (typeof allVisitors)[0]>();

    for (const visitor of allVisitors) {
      const normalizedPhone = normalizePhoneNumber(visitor.whatsappNumber);
      const existing = visitorMap.get(normalizedPhone);

      if (!existing) {
        // First visitor with this phone number
        visitorMap.set(normalizedPhone, visitor);
      } else {
        // Check if this visitor has more sessions or is more recent
        const existingSessionCount = existing.sessions.length;
        const currentSessionCount = visitor.sessions.length;

        if (
          currentSessionCount > existingSessionCount ||
          (currentSessionCount === existingSessionCount &&
            new Date(visitor.createdAt) > new Date(existing.createdAt))
        ) {
          // Merge sessions from the duplicate visitor into the main one
          const mergedSessions = [
            ...existing.sessions,
            ...visitor.sessions,
          ].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          // Use the visitor with more sessions, but merge all sessions
          visitorMap.set(normalizedPhone, {
            ...visitor,
            sessions: mergedSessions,
          });
        } else {
          // Keep existing, but merge sessions
          const mergedSessions = [
            ...existing.sessions,
            ...visitor.sessions,
          ].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          visitorMap.set(normalizedPhone, {
            ...existing,
            sessions: mergedSessions,
          });
        }
      }
    }

    // Convert map to array and sort by most recent session
    const uniqueVisitors = Array.from(visitorMap.values()).sort((a, b) => {
      const aLatest =
        a.sessions.length > 0
          ? new Date(a.sessions[0].createdAt).getTime()
          : new Date(a.createdAt).getTime();
      const bLatest =
        b.sessions.length > 0
          ? new Date(b.sessions[0].createdAt).getTime()
          : new Date(b.createdAt).getTime();
      return bLatest - aLatest;
    });

    // Apply pagination after grouping
    const paginatedVisitors = uniqueVisitors.slice(skip, skip + limit);
    const hasMore = uniqueVisitors.length > skip + limit;
    const total = uniqueVisitors.length;

    return NextResponse.json({
      visitors: paginatedVisitors,
      hasMore,
      total,
      skip,
      limit,
    });
  } catch (error: unknown) {
    console.error("Get visitors error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
