import { Request, Response } from "express";
export declare class VisitorController {
    private service;
    constructor();
    /**
     * Create a visitor
     * POST /api/visitors
     */
    create: (req: Request, res: Response) => Promise<void>;
    /**
     * Get visitors
     * GET /api/visitors
     */
    getAll: (req: Request, res: Response) => Promise<void>;
    /**
     * Create session for existing visitor
     * POST /api/visitors/session
     */
    createSession: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=visitor.controller.d.ts.map