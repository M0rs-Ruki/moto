import { Router, Request, Response } from "express";
import prisma from "../lib/db";
import { whatsappClient } from "../lib/whatsapp";
import { authenticate, asyncHandler } from "../middleware/auth";

const router = Router();

function normalizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return cleaned.substring(2);
  }
  return cleaned.length >= 10 ? cleaned.slice(-10) : cleaned;
}

// Create visitor
router.post(
  "/",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const {
      firstName,
      lastName,
      whatsappNumber,
      email,
      address,
      reason,
      modelIds,
    } = req.body;

    if (!firstName || !lastName || !whatsappNumber || !reason) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const normalizedPhone = normalizePhoneNumber(whatsappNumber);

    const allPotentialVisitors = await prisma.visitor.findMany({
      where: {
        dealershipId: req.user.dealershipId,
      },
      include: {
        sessions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    let visitor = allPotentialVisitors.find(
      (v) => normalizePhoneNumber(v.whatsappNumber) === normalizedPhone
    );

    let whatsappContactId = "";
    const isNewVisitor = !visitor;

    if (visitor) {
      whatsappContactId = visitor.whatsappContactId || "";

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

          if (whatsappContactId) {
            await prisma.visitor.update({
              where: { id: visitor.id },
              data: { whatsappContactId },
            });
          }
        } catch (error: unknown) {
          console.error("Failed to create WhatsApp contact for existing visitor:", (error as Error).message);
          whatsappContactId = "";
        }
      }

      visitor = await prisma.visitor.update({
        where: { id: visitor.id },
        data: {
          firstName,
          lastName,
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
      try {
        const contactResult = await whatsappClient.createContact({
          firstName,
          lastName,
          contact_number: whatsappNumber,
          email: email || "",
          address: address || "",
        });

        whatsappContactId = contactResult.contactId || "";
      } catch (error: unknown) {
        console.error("Failed to create WhatsApp contact:", (error as Error).message);
        whatsappContactId = "";
      }

      visitor = await prisma.visitor.create({
        data: {
          firstName,
          lastName,
          whatsappNumber,
          email: email || null,
          address: address || null,
          whatsappContactId,
          dealershipId: req.user.dealershipId,
        },
        include: {
          sessions: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }

    if (!visitor) {
      res.status(500).json({ error: "Failed to create or find visitor" });
      return;
    }

    const visitorId = visitor.id;
    const sessionCount = visitor.sessions.length;
    const visitNumber = sessionCount + 1;

    const session = await prisma.visitorSession.create({
      data: {
        reason,
        visitorId: visitorId,
        status: "intake",
      },
    });

    if (modelIds && modelIds.length > 0) {
      await prisma.visitorInterest.createMany({
        data: modelIds.map(
          (item: string | { modelId: string; variantId?: string }) => {
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

    let messageStatus = "not_sent";
    let messageError = null;
    const name = `${firstName} ${lastName}`;

    if (whatsappContactId || whatsappNumber) {
      if (isNewVisitor && sessionCount === 0) {
        const welcomeTemplate = await prisma.whatsAppTemplate.findFirst({
          where: {
            dealershipId: req.user.dealershipId,
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
            messageError = (error as Error).message || "Failed to send welcome message";
          }
        }
      } else {
        const returnVisitTemplate = await prisma.whatsAppTemplate.findFirst({
          where: {
            dealershipId: req.user.dealershipId,
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
            messageError = (error as Error).message || "Failed to send return visit message";
          }
        } else {
          const welcomeTemplate = await prisma.whatsAppTemplate.findFirst({
            where: {
              dealershipId: req.user.dealershipId,
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
              console.error("Failed to send welcome message (fallback):", error);
              messageStatus = "failed";
              messageError = (error as Error).message || "Failed to send message";
            }
          }
        }
      }
    }

    res.json({
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
  })
);

// Get visitors
router.get(
  "/",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const phoneNumber = req.query.phone as string | undefined;

    if (phoneNumber) {
      const normalizedPhone = normalizePhoneNumber(phoneNumber);

      const allVisitors = await prisma.visitor.findMany({
        where: {
          dealershipId: req.user.dealershipId,
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

      const visitor = allVisitors.find(
        (v) => normalizePhoneNumber(v.whatsappNumber) === normalizedPhone
      );

      if (!visitor) {
        res.json({ visitor: null, found: false });
        return;
      }

      res.json({
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
      return;
    }

    const limit = parseInt((req.query.limit as string) || "30", 10);
    const skip = parseInt((req.query.skip as string) || "0", 10);

    const allVisitors = await prisma.visitor.findMany({
      where: {
        dealershipId: req.user.dealershipId,
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

    const visitorMap = new Map<string, (typeof allVisitors)[0]>();

    for (const visitor of allVisitors) {
      const normalizedPhone = normalizePhoneNumber(visitor.whatsappNumber);
      const existing = visitorMap.get(normalizedPhone);

      if (!existing) {
        visitorMap.set(normalizedPhone, visitor);
      } else {
        const existingSessionCount = existing.sessions.length;
        const currentSessionCount = visitor.sessions.length;

        if (
          currentSessionCount > existingSessionCount ||
          (currentSessionCount === existingSessionCount &&
            new Date(visitor.createdAt) > new Date(existing.createdAt))
        ) {
          const mergedSessions = [
            ...existing.sessions,
            ...visitor.sessions,
          ].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          visitorMap.set(normalizedPhone, {
            ...visitor,
            sessions: mergedSessions,
          });
        } else {
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

    const paginatedVisitors = uniqueVisitors.slice(skip, skip + limit);
    const hasMore = uniqueVisitors.length > skip + limit;
    const total = uniqueVisitors.length;

    res.json({
      visitors: paginatedVisitors,
      hasMore,
      total,
      skip,
      limit,
    });
  })
);

// Create session for existing visitor
router.post(
  "/session",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.dealershipId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { visitorId, reason, modelIds } = req.body;

    if (!visitorId || !reason) {
      res.status(400).json({ error: "Missing required fields: visitorId and reason" });
      return;
    }

    const visitor = await prisma.visitor.findFirst({
      where: {
        id: visitorId,
        dealershipId: req.user.dealershipId,
      },
      include: {
        sessions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!visitor) {
      res.status(404).json({ error: "Visitor not found" });
      return;
    }

    const sessionCount = visitor.sessions.length;
    const visitNumber = sessionCount + 1;

    const session = await prisma.visitorSession.create({
      data: {
        reason,
        visitorId: visitor.id,
        status: "intake",
      },
    });

    if (modelIds && modelIds.length > 0) {
      const existingInterests = await prisma.visitorInterest.findMany({
        where: {
          visitorId: visitor.id,
        },
        select: {
          modelId: true,
          variantId: true,
        },
      });

      const existingInterestsSet = new Set(
        existingInterests.map((ei) => `${ei.modelId}:${ei.variantId || ""}`)
      );

      type InterestToCreate = {
        visitorId: string;
        modelId: string;
        variantId: string | null;
        sessionId: string;
      };

      const interestsToCreate: InterestToCreate[] = modelIds
        .map((item: string | { modelId: string; variantId?: string }): InterestToCreate | null => {
          const modelId = typeof item === "string" ? item : item.modelId;
          const variantId = typeof item === "object" ? item.variantId : undefined;
          const key = `${modelId}:${variantId || ""}`;

          if (!existingInterestsSet.has(key)) {
            return {
              visitorId: visitor.id,
              modelId,
              variantId: variantId || null,
              sessionId: session.id,
            };
          }
          return null;
        })
        .filter((item: InterestToCreate | null): item is InterestToCreate => item !== null);

      if (interestsToCreate.length > 0) {
        await prisma.visitorInterest.createMany({
          data: interestsToCreate,
        });
      }

      const selectedItems = modelIds.filter(
        (item: string | { modelId: string; variantId?: string }) => {
          const modelId = typeof item === "string" ? item : item.modelId;
          const variantId = typeof item === "object" ? item.variantId : undefined;
          const key = `${modelId}:${variantId || ""}`;
          return existingInterestsSet.has(key);
        }
      );

      if (selectedItems.length > 0) {
        for (const item of selectedItems) {
          const modelId = typeof item === "string" ? item : item.modelId;
          const variantId = typeof item === "object" ? item.variantId : undefined;

          await prisma.visitorInterest.updateMany({
            where: {
              visitorId: visitor.id,
              modelId,
              variantId: variantId || null,
              sessionId: null,
            },
            data: {
              sessionId: session.id,
            },
          });
        }
      }
    }

    const returnVisitTemplate = await prisma.whatsAppTemplate.findFirst({
      where: {
        dealershipId: req.user.dealershipId,
        type: "return_visit",
      },
    });

    const welcomeTemplate = await prisma.whatsAppTemplate.findFirst({
      where: {
        dealershipId: req.user.dealershipId,
        type: "welcome",
      },
    });

    const templateToUse = returnVisitTemplate || welcomeTemplate;

    let messageStatus = "not_sent";
    let messageError = null;

    if (templateToUse && visitor.whatsappContactId) {
      try {
        const visitLabel =
          visitNumber === 1
            ? "1st"
            : visitNumber === 2
            ? "2nd"
            : visitNumber === 3
            ? "3rd"
            : `${visitNumber}th`;

        const parameters =
          templateToUse.type === "return_visit"
            ? [visitor.firstName, visitLabel]
            : [visitor.firstName, new Date().toLocaleDateString()];

        await whatsappClient.sendTemplate({
          contactId: visitor.whatsappContactId,
          contactNumber: visitor.whatsappNumber,
          templateName: templateToUse.templateName,
          templateId: templateToUse.templateId,
          templateLanguage: templateToUse.language,
          parameters,
        });
        messageStatus = "sent";
      } catch (error: unknown) {
        console.error("Failed to send return visit message:", error);
        messageStatus = "failed";
        messageError = (error as Error).message || "Failed to send message";
      }
    }

    res.json({
      success: true,
      session: {
        id: session.id,
        status: session.status,
        visitNumber,
      },
      visitor: {
        id: visitor.id,
        firstName: visitor.firstName,
        lastName: visitor.lastName,
      },
      message: {
        status: messageStatus,
        error: messageError,
      },
    });
  })
);

export default router;
