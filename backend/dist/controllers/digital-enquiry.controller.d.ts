import { Request, Response } from "express";
export declare class DigitalEnquiryController {
    private service;
    constructor();
    /**
     * Create a digital enquiry
     * POST /api/digital-enquiry
     */
    create: (req: Request, res: Response) => Promise<void>;
    /**
     * Get digital enquiries
     * GET /api/digital-enquiry
     */
    getAll: (req: Request, res: Response) => Promise<void>;
    /**
     * Update lead scope
     * PATCH /api/digital-enquiry/:id
     */
    updateLeadScope: (req: Request, res: Response) => Promise<void>;
    /**
     * Bulk upload digital enquiries
     * POST /api/digital-enquiry/bulk
     */
    bulkUpload: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=digital-enquiry.controller.d.ts.map