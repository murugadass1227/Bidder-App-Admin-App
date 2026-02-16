import { UserService } from "./user.service";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    me(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string;
        role: import("@repo/db").$Enums.Role;
    } | null>;
}
//# sourceMappingURL=user.controller.d.ts.map