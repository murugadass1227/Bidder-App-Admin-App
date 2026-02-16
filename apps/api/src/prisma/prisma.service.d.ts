import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@repo/db";
export declare class PrismaService implements OnModuleInit, OnModuleDestroy {
    get client(): PrismaClient;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
//# sourceMappingURL=prisma.service.d.ts.map