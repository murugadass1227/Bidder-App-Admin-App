"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var core_1 = require("@nestjs/core");
var throttler_1 = require("@nestjs/throttler");
var env_config_1 = require("./config/env.config");
var prisma_module_1 = require("./prisma/prisma.module");
var auth_module_1 = require("./modules/auth/auth.module");
var user_module_1 = require("./modules/user/user.module");
var auction_module_1 = require("./modules/auction/auction.module");
var bid_module_1 = require("./modules/bid/bid.module");
var bidding_module_1 = require("./modules/websocket/bidding.module");
var throttler_2 = require("@nestjs/throttler");
var http_exception_filter_1 = require("./common/filters/http-exception.filter");
var jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: [".env", ".env.local"],
                    validate: function () { return env_config_1.env; },
                }),
                throttler_1.ThrottlerModule.forRoot([
                    {
                        ttl: env_config_1.env.RATE_LIMIT_TTL * 1000,
                        limit: env_config_1.env.RATE_LIMIT_MAX,
                    },
                ]),
                prisma_module_1.PrismaModule,
                auth_module_1.AuthModule,
                user_module_1.UserModule,
                auction_module_1.AuctionModule,
                bid_module_1.BidModule,
                bidding_module_1.BiddingGatewayModule,
            ],
            providers: [
                { provide: core_1.APP_FILTER, useClass: http_exception_filter_1.AllExceptionsFilter },
                { provide: core_1.APP_GUARD, useClass: throttler_2.ThrottlerGuard },
                { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            ],
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
