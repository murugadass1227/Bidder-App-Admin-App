import { Strategy } from "passport-jwt";
import { UserService } from "../../user/user.service";
import { JwtPayload } from "../dto/jwt-payload.interface";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
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
//# sourceMappingURL=jwt.strategy.d.ts.map