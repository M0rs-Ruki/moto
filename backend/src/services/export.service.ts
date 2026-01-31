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
   * Get readable range label
   */
  private getRangeLabel(range: DateRange): string {
    const rangeLabels: Record<DateRange, string> = {
      "1m": "Last 1 Month",
      "3m": "Last 3 Months",
      "6m": "Last 6 Months",
      "1y": "Last 1 Year",
    };
    return rangeLabels[range] || "Last 1 Month";
  }

  /**
   * Generate filename with date range info
   */
  private generateFilename(type: ExportType, range: DateRange): string {
    const rangeLabels: Record<DateRange, string> = {
      "1m": "Last_1_Month",
      "3m": "Last_3_Months",
      "6m": "Last_6_Months",
      "1y": "Last_1_Year",
    };
    const typeLabels: Record<ExportType, string> = {
      visitors: "Daily_Walkins",
      "digital-enquiry": "Digital_Enquiry",
      "field-inquiry": "Field_Inquiry",
      "delivery-tickets": "Delivery_Update",
    };
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = now.toLocaleString("en-US", { month: "short" });
    const year = now.getFullYear();
    const timestamp = `${day}_${month}_${year}`;
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
        "S.No": 0, // Will be filled later
        "First Name": visitor.firstName,
        "Last Name": visitor.lastName,
        "WhatsApp Number": visitor.whatsappNumber,
        Email: visitor.email || "-",
        Address: visitor.address || "-",
        "Interested Models": models || "-",
        "Interested Variants": variants || "-",
        "Visit Reason": latestSession?.reason || "-",
        Status: latestSession?.status || "-",
        Feedback: latestSession?.feedback || "-",
        "Test Drive Models": testDriveModels || "-",
        Date: this.formatDate(visitor.createdAt),
      };
    });

    // Add serial numbers
    data.forEach((row, index) => {
      row["S.No"] = index + 1;
    });

    return this.createExcelBuffer(data, "Daily Walkins", "visitors", range);
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
      "S.No": 0, // Will be filled later
      "First Name": enquiry.firstName,
      "Last Name": enquiry.lastName,
      "WhatsApp Number": enquiry.whatsappNumber,
      Email: enquiry.email || "-",
      Address: enquiry.address || "-",
      Reason: enquiry.reason || "-",
      "Lead Scope": enquiry.leadScope || "-",
      Model: enquiry.model?.name || enquiry.modelText || "-",
      Variant: enquiry.variant?.name || "-",
      "Lead Source": enquiry.leadSource?.name || enquiry.sourceText || "-",
      Status: enquiry.sessions[0]?.status || "active",
      Notes: enquiry.sessions[0]?.notes || "-",
      Date: this.formatDate(enquiry.createdAt),
    }));

    // Add serial numbers
    data.forEach((row, index) => {
      row["S.No"] = index + 1;
    });

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
      "S.No": 0, // Will be filled later
      "First Name": inquiry.firstName,
      "Last Name": inquiry.lastName,
      "WhatsApp Number": inquiry.whatsappNumber,
      Email: inquiry.email || "-",
      Address: inquiry.address || "-",
      Reason: inquiry.reason || "-",
      "Lead Scope": inquiry.leadScope || "-",
      Model: inquiry.model?.name || "-",
      Variant: inquiry.variant?.name || "-",
      "Lead Source": inquiry.leadSource?.name || "-",
      Status: inquiry.sessions[0]?.status || "active",
      Notes: inquiry.sessions[0]?.notes || "-",
      Date: this.formatDate(inquiry.createdAt),
    }));

    // Add serial numbers
    data.forEach((row, index) => {
      row["S.No"] = index + 1;
    });

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
      "S.No": 0, // Will be filled later
      "First Name": ticket.firstName,
      "Last Name": ticket.lastName,
      "WhatsApp Number": ticket.whatsappNumber,
      Email: ticket.email || "-",
      Address: ticket.address || "-",
      Model: ticket.model?.name || "-",
      Variant: ticket.variant?.name || "-",
      Description: ticket.description || "-",
      Status: ticket.status || "-",
      "Message Sent": ticket.messageSent ? "Yes" : "No",
      "Completion Sent": ticket.completionSent ? "Yes" : "No",
      "Delivery Date": this.formatDate(ticket.deliveryDate),
      "Date Created": this.formatDate(ticket.createdAt),
    }));

    // Add serial numbers
    data.forEach((row, index) => {
      row["S.No"] = index + 1;
    });

    return this.createExcelBuffer(
      data,
      "Delivery Update",
      "delivery-tickets",
      range,
    );
  }

  /**
   * Create Excel buffer from data with professional formatting
   */
  private createExcelBuffer(
    data: Record<string, string | number>[],
    sheetName: string,
    type: ExportType,
    range: DateRange,
  ): ExportResult {
    // Create title and info rows
    const rangeLabel = this.getRangeLabel(range);
    const exportDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const totalRecords = data.length;

    // Get column headers
    const headers = data.length > 0 ? Object.keys(data[0]) : [];
    const numColumns = headers.length;

    // Create worksheet data with title rows
    const wsData: (string | number)[][] = [
      // Title row
      [sheetName, ...Array(numColumns - 1).fill("")],
      // Info row
      [
        `Data Range: ${rangeLabel}`,
        "",
        `Export Date: ${exportDate}`,
        "",
        `Total Records: ${totalRecords}`,
        ...Array(Math.max(0, numColumns - 5)).fill(""),
      ],
      // Empty row for spacing
      Array(numColumns).fill(""),
      // Header row
      headers,
      // Data rows
      ...data.map((row) => headers.map((h) => row[h] ?? "")),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Auto-size columns based on content
    const maxWidths: number[] = headers.map((header, colIdx) => {
      const headerLen = header.length;
      const maxDataLen = data.reduce((max, row) => {
        const cellLen = String(row[header] || "").length;
        return Math.max(max, cellLen);
      }, 0);
      return Math.min(Math.max(headerLen, maxDataLen) + 2, 40);
    });

    // Ensure first column (S.No) is at least 6 characters
    if (maxWidths.length > 0) {
      maxWidths[0] = Math.max(maxWidths[0], 6);
    }

    worksheet["!cols"] = maxWidths.map((w) => ({ wch: w }));

    // Merge title cell across all columns
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: numColumns - 1 } },
    ];

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
