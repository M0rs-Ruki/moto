import * as XLSX from "xlsx";
import prisma from "../lib/db";

export type ExportType =
  | "visitors"
  | "digital-enquiry"
  | "field-inquiry"
  | "delivery-tickets";
export type DateRange = "1m" | "3m" | "6m" | "1y";

interface ExportResult {
  buffer: Buffer;
  filename: string;
}

export class ExportService {
  /**
   * Calculate the date from which to fetch data based on range
   */
  private getDateFrom(range: DateRange): Date {
    const now = new Date();
    switch (range) {
      case "1m":
        return new Date(now.setMonth(now.getMonth() - 1));
      case "3m":
        return new Date(now.setMonth(now.getMonth() - 3));
      case "6m":
        return new Date(now.setMonth(now.getMonth() - 6));
      case "1y":
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(now.setMonth(now.getMonth() - 1));
    }
  }

  /**
   * Format date for display
   */
  private formatDate(date: Date): string {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  /**
   * Generate filename with date range info
   */
  private generateFilename(type: ExportType, range: DateRange): string {
    const rangeLabels: Record<DateRange, string> = {
      "1m": "1-month",
      "3m": "3-months",
      "6m": "6-months",
      "1y": "1-year",
    };
    const typeLabels: Record<ExportType, string> = {
      visitors: "Daily-Walkins",
      "digital-enquiry": "Digital-Enquiry",
      "field-inquiry": "Field-Inquiry",
      "delivery-tickets": "Delivery-Update",
    };
    const timestamp = new Date().toISOString().split("T")[0];
    return `${typeLabels[type]}_${rangeLabels[range]}_${timestamp}.xlsx`;
  }

  /**
   * Export visitors (Daily Walkins) data
   */
  async exportVisitors(
    dealershipId: string,
    range: DateRange,
  ): Promise<ExportResult> {
    const dateFrom = this.getDateFrom(range);

    const visitors = await prisma.visitor.findMany({
      where: {
        dealershipId,
        createdAt: { gte: dateFrom },
      },
      include: {
        interests: {
          include: {
            model: true,
            variant: true,
          },
        },
        sessions: {
          include: {
            testDrives: {
              include: {
                model: true,
                variant: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = visitors.map((visitor) => {
      const models = visitor.interests
        .map((i) => i.model?.name)
        .filter(Boolean)
        .join(", ");
      const variants = visitor.interests
        .map((i) => i.variant?.name)
        .filter(Boolean)
        .join(", ");
      const latestSession = visitor.sessions[0];
      const testDriveModels =
        latestSession?.testDrives
          ?.map((td) => td.model?.name)
          .filter(Boolean)
          .join(", ") || "";

      return {
        Date: this.formatDate(visitor.createdAt),
        "First Name": visitor.firstName,
        "Last Name": visitor.lastName,
        "WhatsApp Number": visitor.whatsappNumber,
        Email: visitor.email || "",
        Address: visitor.address || "",
        "Interested Models": models,
        "Interested Variants": variants,
        "Visit Reason": latestSession?.reason || "",
        Status: latestSession?.status || "",
        Feedback: latestSession?.feedback || "",
        "Test Drive Models": testDriveModels,
      };
    });

    return this.createExcelBuffer(data, "Visitors", "visitors", range);
  }

  /**
   * Export digital enquiry data
   */
  async exportDigitalEnquiry(
    dealershipId: string,
    range: DateRange,
  ): Promise<ExportResult> {
    const dateFrom = this.getDateFrom(range);

    const enquiries = await prisma.digitalEnquiry.findMany({
      where: {
        dealershipId,
        createdAt: { gte: dateFrom },
      },
      include: {
        model: true,
        variant: true,
        leadSource: true,
        sessions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = enquiries.map((enquiry) => ({
      Date: this.formatDate(enquiry.createdAt),
      "First Name": enquiry.firstName,
      "Last Name": enquiry.lastName,
      "WhatsApp Number": enquiry.whatsappNumber,
      Email: enquiry.email || "",
      Address: enquiry.address || "",
      Reason: enquiry.reason,
      "Lead Scope": enquiry.leadScope,
      Model: enquiry.model?.name || enquiry.modelText || "",
      Variant: enquiry.variant?.name || "",
      "Lead Source": enquiry.leadSource?.name || enquiry.sourceText || "",
      Status: enquiry.sessions[0]?.status || "active",
      Notes: enquiry.sessions[0]?.notes || "",
    }));

    return this.createExcelBuffer(
      data,
      "Digital Enquiry",
      "digital-enquiry",
      range,
    );
  }

  /**
   * Export field inquiry data
   */
  async exportFieldInquiry(
    dealershipId: string,
    range: DateRange,
  ): Promise<ExportResult> {
    const dateFrom = this.getDateFrom(range);

    const inquiries = await prisma.fieldInquiry.findMany({
      where: {
        dealershipId,
        createdAt: { gte: dateFrom },
      },
      include: {
        model: true,
        variant: true,
        leadSource: true,
        sessions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = inquiries.map((inquiry) => ({
      Date: this.formatDate(inquiry.createdAt),
      "First Name": inquiry.firstName,
      "Last Name": inquiry.lastName,
      "WhatsApp Number": inquiry.whatsappNumber,
      Email: inquiry.email || "",
      Address: inquiry.address || "",
      Reason: inquiry.reason,
      "Lead Scope": inquiry.leadScope,
      Model: inquiry.model?.name || "",
      Variant: inquiry.variant?.name || "",
      "Lead Source": inquiry.leadSource?.name || "",
      Status: inquiry.sessions[0]?.status || "active",
      Notes: inquiry.sessions[0]?.notes || "",
    }));

    return this.createExcelBuffer(
      data,
      "Field Inquiry",
      "field-inquiry",
      range,
    );
  }

  /**
   * Export delivery tickets data
   */
  async exportDeliveryTickets(
    dealershipId: string,
    range: DateRange,
  ): Promise<ExportResult> {
    const dateFrom = this.getDateFrom(range);

    const tickets = await prisma.deliveryTicket.findMany({
      where: {
        dealershipId,
        createdAt: { gte: dateFrom },
      },
      include: {
        model: true,
        variant: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const data = tickets.map((ticket) => ({
      "Date Created": this.formatDate(ticket.createdAt),
      "Delivery Date": this.formatDate(ticket.deliveryDate),
      "First Name": ticket.firstName,
      "Last Name": ticket.lastName,
      "WhatsApp Number": ticket.whatsappNumber,
      Email: ticket.email || "",
      Address: ticket.address || "",
      Model: ticket.model?.name || "",
      Variant: ticket.variant?.name || "",
      Description: ticket.description || "",
      Status: ticket.status,
      "Message Sent": ticket.messageSent ? "Yes" : "No",
      "Completion Sent": ticket.completionSent ? "Yes" : "No",
    }));

    return this.createExcelBuffer(
      data,
      "Delivery Tickets",
      "delivery-tickets",
      range,
    );
  }

  /**
   * Create Excel buffer from data
   */
  private createExcelBuffer(
    data: Record<string, string | number>[],
    sheetName: string,
    type: ExportType,
    range: DateRange,
  ): ExportResult {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Auto-size columns
    const maxWidths: Record<string, number> = {};
    if (data.length > 0) {
      Object.keys(data[0]).forEach((key) => {
        maxWidths[key] = Math.max(
          key.length,
          ...data.map((row) => String(row[key] || "").length),
        );
      });
      worksheet["!cols"] = Object.values(maxWidths).map((w) => ({
        wch: Math.min(w + 2, 50),
      }));
    }

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    const filename = this.generateFilename(type, range);

    return { buffer, filename };
  }

  /**
   * Export data based on type
   */
  async export(
    type: ExportType,
    dealershipId: string,
    range: DateRange,
  ): Promise<ExportResult> {
    switch (type) {
      case "visitors":
        return this.exportVisitors(dealershipId, range);
      case "digital-enquiry":
        return this.exportDigitalEnquiry(dealershipId, range);
      case "field-inquiry":
        return this.exportFieldInquiry(dealershipId, range);
      case "delivery-tickets":
        return this.exportDeliveryTickets(dealershipId, range);
      default:
        throw new Error(`Unknown export type: ${type}`);
    }
  }
}
