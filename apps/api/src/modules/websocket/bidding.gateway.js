"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiddingGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var socket_io_1 = require("socket.io");
var common_1 = require("@nestjs/common");
var bid_service_1 = require("../bid/bid.service");
var BiddingGateway = /** @class */ (function () {
    function BiddingGateway(bidService) {
        this.bidService = bidService;
        this.logger = new common_1.Logger(BiddingGateway_1.name);
    }
    BiddingGateway_1 = BiddingGateway;
    BiddingGateway.prototype.handleBid = function (payload, _client) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, dto, bid, auctionId, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = payload.userId, dto = __rest(payload, ["userId"]);
                        if (!userId) {
                            this.logger.warn("Bid received without userId");
                            return [2 /*return*/, { success: false, error: "Unauthorized" }];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.bidService.place(userId, dto)];
                    case 2:
                        bid = _a.sent();
                        auctionId = dto.auctionId;
                        this.server.to("auction:".concat(auctionId)).emit("bid:update", {
                            bid: {
                                id: bid.id,
                                amount: Number(bid.amount),
                                userId: bid.userId,
                                createdAt: bid.createdAt,
                                user: bid.user,
                            },
                            currentPrice: Number(bid.auction.currentPrice),
                        });
                        return [2 /*return*/, { success: true, bid: bid }];
                    case 3:
                        err_1 = _a.sent();
                        this.logger.error(err_1);
                        return [2 /*return*/, {
                                success: false,
                                error: err_1 instanceof Error ? err_1.message : "Failed to place bid",
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BiddingGateway.prototype.handleJoin = function (auctionId, client) {
        client.join("auction:".concat(auctionId));
    };
    BiddingGateway.prototype.handleLeave = function (auctionId, client) {
        client.leave("auction:".concat(auctionId));
    };
    var BiddingGateway_1;
    __decorate([
        (0, websockets_1.WebSocketServer)(),
        __metadata("design:type", socket_io_1.Server)
    ], BiddingGateway.prototype, "server", void 0);
    __decorate([
        (0, websockets_1.SubscribeMessage)("bid"),
        __param(0, (0, websockets_1.MessageBody)()),
        __param(1, (0, websockets_1.ConnectedSocket)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], BiddingGateway.prototype, "handleBid", null);
    __decorate([
        (0, websockets_1.SubscribeMessage)("join"),
        __param(0, (0, websockets_1.MessageBody)()),
        __param(1, (0, websockets_1.ConnectedSocket)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], BiddingGateway.prototype, "handleJoin", null);
    __decorate([
        (0, websockets_1.SubscribeMessage)("leave"),
        __param(0, (0, websockets_1.MessageBody)()),
        __param(1, (0, websockets_1.ConnectedSocket)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], BiddingGateway.prototype, "handleLeave", null);
    BiddingGateway = BiddingGateway_1 = __decorate([
        (0, websockets_1.WebSocketGateway)({
            cors: { origin: "*" },
            namespace: "bidding",
        }),
        __metadata("design:paramtypes", [bid_service_1.BidService])
    ], BiddingGateway);
    return BiddingGateway;
}());
exports.BiddingGateway = BiddingGateway;
