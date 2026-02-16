"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionModule = void 0;
var common_1 = require("@nestjs/common");
var auction_controller_1 = require("./auction.controller");
var auction_service_1 = require("./auction.service");
var AuctionModule = /** @class */ (function () {
    function AuctionModule() {
    }
    AuctionModule = __decorate([
        (0, common_1.Module)({
            controllers: [auction_controller_1.AuctionController],
            providers: [auction_service_1.AuctionService],
            exports: [auction_service_1.AuctionService],
        })
    ], AuctionModule);
    return AuctionModule;
}());
exports.AuctionModule = AuctionModule;
