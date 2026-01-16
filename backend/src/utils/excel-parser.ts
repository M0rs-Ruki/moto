/**
 * Excel parsing utilities
 */
import * as XLSX from "xlsx";
import { EXCEL } from "../config/constants";

export interface ExcelRow {
  Date?: string | number | Date;
  Name?: string;
  "WhatsApp Number"?: string;
  Location?: string;
  Model?: string;
  Source?: string;
}

export interface ExcelParseResult {
  rows: ExcelRow[];
  errors: string[];
}

/**
 * Parse Excel file buffer
 */
export function parseExcelFile(buffer: Buffer): ExcelParseResult {
  const errors: string[] = [];

  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      errors.push("Excel file has no sheets");
      return { rows: [], errors };
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rows: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);

    if (rows.length === 0) {
      errors.push("Excel file is empty");
      return { rows: [], errors };
    }

    return { rows, errors };
  } catch (error) {
    errors.push(`Failed to parse Excel file: ${(error as Error).message}`);
    return { rows: [], errors };
  }
}

/**
 * Validate Excel file type
 */
export function validateExcelFileType(fileName: string): boolean {
  const lowerFileName = fileName.toLowerCase();
  return EXCEL.SUPPORTED_EXTENSIONS.some((ext) => lowerFileName.endsWith(ext));
}

/**
 * Validate required columns in Excel
 */
export function validateRequiredColumns(
  firstRow: ExcelRow,
  requiredColumns: string[]
): { valid: boolean; missingColumns: string[] } {
  const missingColumns = requiredColumns.filter((col) => !(col in firstRow));
  return {
    valid: missingColumns.length === 0,
    missingColumns,
  };
}

/**
 * Parse Excel date value
 */
export function parseExcelDate(
  dateValue?: string | number | Date
): Date | undefined {
  if (!dateValue) {
    return undefined;
  }

  // Check if it's already a Date object
  if (dateValue instanceof Date) {
    return dateValue;
  }

  // If it's a number, it's an Excel date serial number
  if (typeof dateValue === "number") {
    // Excel epoch is January 1, 1900, JavaScript epoch is January 1, 1970
    const excelEpoch = new Date(1899, 11, 30); // Dec 30, 1899
    return new Date(excelEpoch.getTime() + dateValue * 86400000);
  }

  // If it's a string, try parsing as date
  if (typeof dateValue === "string") {
    const parsedDate = new Date(dateValue);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  return undefined;
}
