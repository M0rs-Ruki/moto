import { Request, Response } from "express";
export declare class FieldInquiryController {
    private service;
    constructor();
    /**
     * Create a field inquiry
     * POST /api/field-inquiry
     */
    create: (req: Request, res: Response) => Promise<void>;
    /**
     * Get field inquiries
     * GET /api/field-inquiry
     */
    getAll: (req: Request, res: Response) => Promise<void>;
    /**
     * Update lead scope
     * PATCH /api/field-inquiry/:id
     */
    updateLeadScope: (req: Request, res: Response) => Promise<void>;
    /**
     * Bulk upload field inquiries
     * POST /api/field-inquiry/bulk
     */
    bulkUpload: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=field-inquiry.controller.d.ts.map