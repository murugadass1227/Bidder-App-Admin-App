import { CreateAuctionDto } from "./create-auction.dto";
import { AuctionStatus } from "@repo/db";
declare const UpdateAuctionDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateAuctionDto>>;
export declare class UpdateAuctionDto extends UpdateAuctionDto_base {
    status?: AuctionStatus;
}
export {};
//# sourceMappingURL=update-auction.dto.d.ts.map