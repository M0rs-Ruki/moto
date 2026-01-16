import { PrismaClient } from "@prisma/client";
declare const prisma: PrismaClient<{
    log: ("warn" | "error")[];
    datasources: {
        db: {
            url: string;
        };
    };
}, "warn" | "error", import("@prisma/client/runtime/library").DefaultArgs>;
export default prisma;
//# sourceMappingURL=db.d.ts.map