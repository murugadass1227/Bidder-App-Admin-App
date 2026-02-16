import { Strategy } from "passport-jwt";
import { UserService } from "../../user/user.service";
import { JwtPayload } from "../dto/jwt-payload.interface";
declare const JwtRefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private userService;
    constructor(userService: UserService);
    validate(payload: JwtPayload): Promise<{
        sub: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string;
        passwordHash: string;
        role: import("@repo/db").$Enums.Role;
    }>;
}
export {};
//# sourceMappingURL=jwt-refresh.strategy.d.ts.map