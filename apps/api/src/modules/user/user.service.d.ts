import { PrismaService } from "../../prisma/prisma.service";
import { RegisterDto } from "../auth/dto/register.dto";
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string;
        passwordHash: string;
        role: import("@repo/db").$Enums.Role;
    } | null>;
    findById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string;
        passwordHash: string;
        role: import("@repo/db").$Enums.Role;
    } | null>;
    create(dto: RegisterDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string;
        passwordHash: string;
        role: import("@repo/db").$Enums.Role;
    }>;
}
//# sourceMappingURL=user.service.d.ts.map