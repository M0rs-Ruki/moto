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
export declare function parseExcelFile(buffer: Buffer): ExcelParseResult;
/**
 * Validate Excel file type
 */
export declare function validateExcelFileType(fileName: string): boolean;
/**
 * Validate required columns in Excel
 */
export declare function validateRequiredColumns(firstRow: ExcelRow, requiredColumns: string[]): {
    valid: boolean;
    missingColumns: string[];
};
/**
 * Parse Excel date value
 */
export declare function parseExcelDate(dateValue?: string | number | Date): Date | undefined;
//# sourceMappingURL=excel-parser.d.ts.map