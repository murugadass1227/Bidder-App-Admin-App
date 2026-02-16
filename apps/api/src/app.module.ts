import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";
import { env } from "./config/env.config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { AuctionModule } from "./modules/auction/auction.module";
import { BidModule } from "./modules/bid/bid.module";
import { BiddingGatewayModule } from "./modules/websocket/bidding.module";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { HealthController } from "./health.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.local"],
      validate: () => env,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: env.RATE_LIMIT_TTL * 1000,
        limit: env.RATE_LIMIT_MAX,
      },
    ]),
    PrismaModule,
    AuthModule,
    UserModule,
    AuctionModule,
    BidModule,
    BiddingGatewayModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
