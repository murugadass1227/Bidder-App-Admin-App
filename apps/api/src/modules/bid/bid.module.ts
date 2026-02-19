import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { BidController } from "./bid.controller";
import { BidService } from "./bid.service";

@Module({
  imports: [UserModule],
  controllers: [BidController],
  providers: [BidService],
  exports: [BidService],
})
export class BidModule {}
