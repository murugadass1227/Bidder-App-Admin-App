"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiddingGatewayModule = void 0;
var common_1 = require("@nestjs/common");
var bidding_gateway_1 = require("./bidding.gateway");
var bid_module_1 = require("../bid/bid.module");
var BiddingGatewayModule = /** @class */ (function () {
    function BiddingGatewayModule() {
    }
    BiddingGatewayModule = __decorate([
        (0, common_1.Module)({
            imports: [bid_module_1.BidModule],
            providers: [bidding_gateway_1.BiddingGateway],
        })
    ], BiddingGatewayModule);
    return BiddingGatewayModule;
}());
exports.BiddingGatewayModule = BiddingGatewayModule;
