"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExcelFile = parseExcelFile;
exports.validateExcelFileType = validateExcelFileType;
exports.validateRequiredColumns = validateRequiredColumns;
exports.parseExcelDate = parseExcelDate;
/**
 * Excel parsing utilities
 */
const XLSX = __importStar(require("xlsx"));
const constants_1 = require("../config/constants");
/**
 * Parse Excel file buffer
 */
function parseExcelFile(buffer) {
    const errors = [];
    try {
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
            errors.push("Excel file has no sheets");
            return { rows: [], errors };
        }
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);
        if (rows.length === 0) {
            errors.push("Excel file is empty");
            return { rows: [], errors };
        }
        return { rows, errors };
    }
    catch (error) {
        errors.push(`Failed to parse Excel file: ${error.message}`);
        return { rows: [], errors };
    }
}
/**
 * Validate Excel file type
 */
function validateExcelFileType(fileName) {
    const lowerFileName = fileName.toLowerCase();
    return constants_1.EXCEL.SUPPORTED_EXTENSIONS.some((ext) => lowerFileName.endsWith(ext));
}
/**
 * Validate required columns in Excel
 */
function validateRequiredColumns(firstRow, requiredColumns) {
    const missingColumns = requiredColumns.filter((col) => !(col in firstRow));
    return {
        valid: missingColumns.length === 0,
        missingColumns,
    };
}
/**
 * Parse Excel date value
 */
function parseExcelDate(dateValue) {
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
//# sourceMappingURL=excel-parser.js.map